import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './index';
import * as useProfileHook from '../../../hooks/operator/useProfile';

vi.mock('../../../hooks/operator/useProfile');

describe('Profile', () => {
  const mockUser = {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    password: 'hashedpassword',
    situacao: 'ATIVO' as const,
    roles: [{ id: 1, authority: 'ROLE_OPERATOR' }],
    userAnexo: {
      codigo: 1,
      anexo: {
        codigo: 1,
        nome: 'profile.jpg',
        mimeType: 'image/jpeg',
        url: 'http://example.com/profile.jpg',
        checksum: 'abc123',
        binario: {
          codigo: 1,
          bytes: [1,2,3,4,5],
        },
      },
      user: {} as any,
    },
  };

  const mockUseProfile = {
    user: mockUser,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfileHook.useProfile).mockReturnValue(mockUseProfile);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render user information', () => {
    renderWithRouter(<Profile />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao.silva@example.com')).toBeInTheDocument();
  });

  it('should render edit profile button', () => {
    renderWithRouter(<Profile />);

    const editButton = screen.getByRole('link', { name: /Alterar senha/i });
    expect(editButton).toHaveAttribute('href', '/profile/1/edit');
  });

  it('should render user image when userAnexo exists', () => {
    renderWithRouter(<Profile />);

    const image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/jpeg;base64,'));
  });

  it('should not render image when userAnexo is null', () => {
    vi.mocked(useProfileHook.useProfile).mockReturnValue({
      ...mockUseProfile,
      user: { ...mockUser, userAnexo: undefined },
    });

    renderWithRouter(<Profile />);

    const images = screen.queryAllByRole('img', { hidden: true });
    expect(images).toHaveLength(0);
  });

  it('should handle loading state', () => {
    vi.mocked(useProfileHook.useProfile).mockReturnValue({
      user: undefined,
      loading: true,
      error: null,
    });

    renderWithRouter(<Profile />);

    expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
  });

  it('should handle user not found', () => {
    vi.mocked(useProfileHook.useProfile).mockReturnValue({
      user: undefined,
      loading: false,
      error: null,
    });

    renderWithRouter(<Profile />);

    expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
  });
});
