package br.com.todeschini.persistence.util;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JpaMetadataUtilsTest {

    @Test
    void testGetTableName_Success() {
        // Arrange
        // A classe MockEntity possui a anotação @Table(name = "mockentity")

        // Act
        String tableName = JpaMetadataUtils.getTableName(MockEntity.class);

        // Assert
        assertEquals("mockentity", tableName);
    }

    @Test
    void testGetTableName_NoTableAnnotation() {
        // Arrange
        // A classe MockEntityWithoutTable não possui a anotação @Table

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> JpaMetadataUtils.getTableName(MockEntityWithoutTable.class)
        );

        assertEquals("Nenhuma classe na hierarquia de br.com.todeschini.persistence.util.JpaMetadataUtilsTest$MockEntityWithoutTable possui a anotação @Table.", exception.getMessage());
    }

    @Test
    void testGetIdColumnName_Success() {
        // Arrange
        // A classe MockEntity possui o campo id anotado com @Id

        // Act
        String idColumnName = JpaMetadataUtils.getIdColumnName(MockEntity.class);

        // Assert
        assertEquals("id", idColumnName); // O campo é convertido para snake_case.
    }

    @Test
    void testGetIdColumnName_NoIdAnnotation() {
        // Arrange
        // A classe MockEntityWithoutId não possui a anotação @Id

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> JpaMetadataUtils.getIdColumnName(MockEntityWithoutId.class)
        );

        assertEquals("Nenhuma classe na hierarquia de br.com.todeschini.persistence.util.JpaMetadataUtilsTest$MockEntityWithoutId possui um campo anotado com @Id.", exception.getMessage());
    }

    @Test
    void testExtractId_Success() throws IllegalAccessException {
        // Arrange
        MockEntity entity = new MockEntity();
        entity.id = 123;  // Atribui um valor ao ID

        // Act
        Integer id = JpaMetadataUtils.extractId(entity);

        // Assert
        assertEquals(123, id);
    }

    @Test
    void testExtractId_NoIdAnnotation() {
        // Arrange
        // A classe MockEntityWithoutId não possui a anotação @Id
        MockEntityWithoutId entity = new MockEntityWithoutId();

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> JpaMetadataUtils.extractId(entity)
        );

        assertEquals("Nenhuma classe na hierarquia de br.com.todeschini.persistence.util.JpaMetadataUtilsTest$MockEntityWithoutId possui um campo anotado com @Id.", exception.getMessage());
    }

    @Test
    void testExtractId_IllegalAccess() {
        // Arrange
        MockEntity entity = new MockEntity();
        entity.id = null;  // simula que o valor do ID é nulo

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> JpaMetadataUtils.extractId(entity)
        );

        assertEquals("O campo ID não pode ser nulo.", exception.getMessage());
    }

    // Classe mockada para simular a entidade com @Table
    @Table(name = "mockentity")
    private static class MockEntity {
        @Id
        private Integer id;
    }

    // Classe mockada sem @Table
    private static class MockEntityWithoutTable {
        @Id
        private Integer id;
    }

    // Classe mockada sem @Id
    private static class MockEntityWithoutId {
        private Integer id;
    }
}

