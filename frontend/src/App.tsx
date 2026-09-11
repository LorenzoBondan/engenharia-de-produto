import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from './utils/history';
import { PrivateRoute } from './components/PrivateRoute';
import { AccessTokenPayloadDTO } from './models/auth';
import { ContextToken } from './utils/context-token';
import * as authService from './services/authService';
import Auth from './routes/Auth';
import Operator from './routes/Operator';
import Operations from './routes/Operator/Operations';
import HomeBaseMaterials from './routes/Operator/HomeBaseMaterials';
import MDPPage from './routes/Operator/HomeBaseMaterials/MainComponents/MDPPage';
import MDFPage from './routes/Operator/HomeBaseMaterials/MainComponents/MDFPage';
import AluminiumPage from './routes/Operator/HomeBaseMaterials/MainComponents/AluminiumPage';
import PackagingPage from './routes/Operator/HomeBaseMaterials/MainComponents/PackagingPage';
import MachinePage from './routes/Operator/HomeBaseMaterials/MainComponents/MachinePage';
import PublicPage from './routes/Operator/HomeBaseMaterials/MainComponents/PublicPage';
import HomeItems from './routes/Operator/HomeItems';
import HomeStruct from './routes/Operator/HomeStructs';
import Sheets from './routes/CRUDs/MDP/Sheet';
import SheetForm from './routes/CRUDs/MDP/Sheet/SheetForm';
import SheetList from './routes/CRUDs/MDP/Sheet/SheetList';
import Glues from './routes/CRUDs/MDP/Glue';
import GlueList from './routes/CRUDs/MDP/Glue/GlueList';
import GlueForm from './routes/CRUDs/MDP/Glue/GlueForm';
import EdgeBandings from './routes/CRUDs/MDP/EdgeBanding';
import EdgeBandingList from './routes/CRUDs/MDP/EdgeBanding/EdgeBandingList';
import EdgeBandingForm from './routes/CRUDs/MDP/EdgeBanding/EdgeBandingForm';
import Paintings from './routes/CRUDs/MDF/Painting';
import PaintingList from './routes/CRUDs/MDF/Painting/PaintingList';
import PaintingForm from './routes/CRUDs/MDF/Painting/PaintingForm';
import PaintingBorderBackgroundForm from './routes/CRUDs/MDF/PaintingBorderBackground/PaintingBorderBackgroundForm';
import PaintingBorderBackgrounds from './routes/CRUDs/MDF/PaintingBorderBackground';
import PaintingBorderBackgroundList from './routes/CRUDs/MDF/PaintingBorderBackground/PaintingBorderBackgroundList';
import Polyesters from './routes/CRUDs/MDF/Polyester';
import PolyesterList from './routes/CRUDs/MDF/Polyester/PolyesterList';
import PolyesterForm from './routes/CRUDs/MDF/Polyester/PolyesterForm';
import Colors from './routes/CRUDs/Public/Color';
import ColorList from './routes/CRUDs/Public/Color/ColorList';
import ColorForm from './routes/CRUDs/Public/Color/ColorForm';
import CornerBrackets from './routes/CRUDs/Packaging/CornerBracket';
import CornerBracketList from './routes/CRUDs/Packaging/CornerBracket/CornerBracketList';
import CornerBracketForm from './routes/CRUDs/Packaging/CornerBracket/CornerBracketForm';
import NonwovenFabrics from './routes/CRUDs/Packaging/NonwovenFabric';
import NonwovenFabricList from './routes/CRUDs/Packaging/NonwovenFabric/NonwovenFabricList';
import NonwovenFabricForm from './routes/CRUDs/Packaging/NonwovenFabric/NonwovenFabricForm';
import Plastics from './routes/CRUDs/Packaging/Plastic';
import PlasticList from './routes/CRUDs/Packaging/Plastic/PlasticList';
import PlasticForm from './routes/CRUDs/Packaging/Plastic/PlasticForm';
import Polyethylenes from './routes/CRUDs/Packaging/Polyethylene';
import PolyethyleneList from './routes/CRUDs/Packaging/Polyethylene/PolyethyleneList';
import PolyethyleneForm from './routes/CRUDs/Packaging/Polyethylene/PolyethyleneForm';
import Moldings from './routes/CRUDs/Aluminium/Molding';
import MoldingList from './routes/CRUDs/Aluminium/Molding/MoldingList';
import MoldingForm from './routes/CRUDs/Aluminium/Molding/MoldingForm';
import Accessories from './routes/CRUDs/Aluminium/Accessory';
import AccessoryList from './routes/CRUDs/Aluminium/Accessory/AccessoryList';
import AccessoryForm from './routes/CRUDs/Aluminium/Accessory/AccessoryForm';
import MachineGroups from './routes/CRUDs/Guides/MachineGroup';
import MachineGroupList from './routes/CRUDs/Guides/MachineGroup/MachineGroupList';
import MachineGroupForm from './routes/CRUDs/Guides/MachineGroup/MachineGroupForm';
import Models from './routes/CRUDs/Public/Model';
import ModelList from './routes/CRUDs/Public/Model/ModelList';
import ModelForm from './routes/CRUDs/Public/Model/ModelForm';
import ComponentCategories from './routes/CRUDs/Public/ComponentCategory';
import ComponentCategoryList from './routes/CRUDs/Public/ComponentCategory/ComponentCategoryList';
import ComponentCategoryForm from './routes/CRUDs/Public/ComponentCategory/ComponentCategoryForm';
import Machines from './routes/CRUDs/Guides/Machines';
import MachineList from './routes/CRUDs/Guides/Machines/MachineList';
import MachineForm from './routes/CRUDs/Guides/Machines/MachineForm';
import Fathers from './routes/CRUDs/Items/Father';
import FatherList from './routes/CRUDs/Items/Father/FatherList';
import FatherForm from './routes/CRUDs/Items/Father/FatherForm';
import Sons from './routes/CRUDs/Items/Son';
import SonList from './routes/CRUDs/Items/Son/SonList';
import SonForm from './routes/CRUDs/Items/Son/SonForm';
import Guides from './routes/CRUDs/Items/Guides';
import GuideList from './routes/CRUDs/Items/Guides/GuideList';
import GuideForm from './routes/CRUDs/Items/Guides/GuideForm';
import Measures from './routes/CRUDs/Public/Measures';
import MeasureList from './routes/CRUDs/Public/Measures/MeasureList';
import MeasureForm from './routes/CRUDs/Public/Measures/MeasureForm';
import FatherDetails from './routes/Operator/Details/FatherDetails';
import SonDetails from './routes/Operator/Details/SonDetails';
import UsedMaterials from './routes/CRUDs/Used/UsedMaterial';
import UsedMaterialForm from './routes/CRUDs/Used/UsedMaterial/UsedMaterialForm';
import UsedAccessories from './routes/CRUDs/Used/UsedAccessory';
import UsedAccessoryForm from './routes/CRUDs/Used/UsedAccessory/UsedAccessoryForm';
import GuideMachines from './routes/CRUDs/Guides/GuideMachine';
import GuideMachineForm from './routes/CRUDs/Guides/GuideMachine/GuideMachineForm';
import GuideDetails from './routes/Operator/Details/GuideDetails';
import Trash from './routes/Admin/Trash';
import Admin from './routes/Admin';
import AdminHome from './routes/Admin/Home';
import Users from './routes/Admin/User';
import UserList from './routes/Admin/User/UserList';
import UserForm from './routes/Admin/User/UserForm';
import Reports from './routes/Operator/Reports';
import SingleStruct from './routes/Operator/Structs/SingleStruct';
import MultiStruct from './routes/Operator/Structs/MultiStruct';
import { ToastContainer } from 'react-toastify';
import Profile from './routes/Operator/Profile';
import EditProfile from './routes/Operator/Profile/EditProfile';
import { ProgressBar } from './components/Loading';
import { useNavigationProgress } from './hooks/common/useNavigationProgress';
import ChatWidget from './components/assistant/ChatWidget';

function AppContent() {
  const { isNavigating } = useNavigationProgress();
  const isAuthenticated = authService.isAuthenticated();

  return (
    <>
      <ProgressBar isAnimating={isNavigating} />
          <Routes>
            <Route path="/login" element={<Auth />} />

            <Route path="/" element={<PrivateRoute roles={['ROLE_ADMIN', 'ROLE_ANALYST', 'ROLE_OPERATOR']}><Operator /></PrivateRoute>} >
              <Route index element={<Operations />} />
              <Route path="operations" element={<Operations />} />

              <Route path="homestructs" element={<HomeStruct />} />
              <Route path="homeitems" element={<HomeItems />} />

              <Route path="singlestruct" element={<SingleStruct />} />
              <Route path="multistruct" element={<MultiStruct />} />

              <Route path="homebasematerials" element={<HomeBaseMaterials />} />
              <Route path="homebasematerials/mdp" element={<MDPPage />} />
              <Route path="homebasematerials/mdf" element={<MDFPage />} />
              <Route path="homebasematerials/aluminium" element={<AluminiumPage />} />
              <Route path="homebasematerials/packaging" element={<PackagingPage />} />
              <Route path="homebasematerials/machines" element={<MachinePage />} />
              <Route path="homebasematerials/public" element={<PublicPage />} />

              <Route path="sheets" element={<Sheets />}>
                <Route index element={<SheetList />} />
                <Route path=":sheetId" element={<SheetForm />} />
              </Route>

              <Route path="edgebandings" element={<EdgeBandings />}>
                <Route index element={<EdgeBandingList />} />
                <Route path=":edgeBandingId" element={<EdgeBandingForm />} />
              </Route>

              <Route path="glues" element={<Glues />}>
                <Route index element={<GlueList />} />
                <Route path=":glueId" element={<GlueForm />} />
              </Route>

              <Route path="paintings" element={<Paintings />}>
                <Route index element={<PaintingList />} />
                <Route path=":paintingId" element={<PaintingForm />} />
              </Route>

              <Route path="paintingborderbackgrounds" element={<PaintingBorderBackgrounds />}>
                <Route index element={<PaintingBorderBackgroundList />} />
                <Route path=":paintingBorderBackgroundId" element={<PaintingBorderBackgroundForm />} />
              </Route>

              <Route path="polyesters" element={<Polyesters />}>
                <Route index element={<PolyesterList />} />
                <Route path=":polyesterId" element={<PolyesterForm />} />
              </Route>

              <Route path="cornerbrackets" element={<CornerBrackets />}>
                <Route index element={<CornerBracketList />} />
                <Route path=":cornerBracketId" element={<CornerBracketForm />} />
              </Route>

              <Route path="nonwovenfabrics" element={<NonwovenFabrics />}>
                <Route index element={<NonwovenFabricList />} />
                <Route path=":nonwovenFabricId" element={<NonwovenFabricForm />} />
              </Route>

              <Route path="plastics" element={<Plastics />}>
                <Route index element={<PlasticList />} />
                <Route path=":plasticId" element={<PlasticForm />} />
              </Route>

              <Route path="polyethylenes" element={<Polyethylenes />}>
                <Route index element={<PolyethyleneList />} />
                <Route path=":polyethyleneId" element={<PolyethyleneForm />} />
              </Route>

              <Route path="colors" element={<Colors />}>
                <Route index element={<ColorList />} />
                <Route path=":colorId" element={<ColorForm />} />
              </Route>

              <Route path="models" element={<Models />}>
                <Route index element={<ModelList />} />
                <Route path=":modelId" element={<ModelForm />} />
              </Route>

              <Route path="componentcategories" element={<ComponentCategories />}>
                <Route index element={<ComponentCategoryList />} />
                <Route path=":componentCategoryId" element={<ComponentCategoryForm />} />
              </Route>

              <Route path="measures" element={<Measures />}>
                <Route index element={<MeasureList />} />
                <Route path=":measureId" element={<MeasureForm />} />
              </Route>

              <Route path="moldings" element={<Moldings />}>
                <Route index element={<MoldingList />} />
                <Route path=":moldingId" element={<MoldingForm />} />
              </Route>

              <Route path="accessories" element={<Accessories />}>
                <Route index element={<AccessoryList />} />
                <Route path=":accessoryId" element={<AccessoryForm />} />
              </Route>

              <Route path="machinegroups" element={<MachineGroups />}>
                <Route index element={<MachineGroupList />} />
                <Route path=":machineGroupId" element={<MachineGroupForm />} />
              </Route>

              <Route path="machines" element={<Machines />}>
                <Route index element={<MachineList />} />
                <Route path=":machineId" element={<MachineForm />} />
              </Route>

              <Route path="fathers" element={<Fathers />}>
                <Route index element={<FatherList />} />
                <Route path=":fatherId" element={<FatherForm />} />
                <Route path="details/:fatherId" element={<FatherDetails />} />
              </Route>

              <Route path="sons" element={<Sons />}>
                <Route index element={<SonList />} />
                <Route path=":sonId" element={<SonForm />} />
                <Route path="details/:sonId" element={<SonDetails />} />
              </Route>

              <Route path="guides" element={<Guides />}>
                <Route index element={<GuideList />} />
                <Route path=":guideId" element={<GuideForm />} />
                <Route path="details/:guideId" element={<GuideDetails />} />
              </Route>

              <Route path="usedMaterials" element={<UsedMaterials />}>
                <Route index element={<UsedMaterialForm />} />
                <Route path=":usedMaterialId" element={<UsedMaterialForm />} />
              </Route>

              <Route path="usedAccessories" element={<UsedAccessories />}>
                <Route index element={<UsedAccessoryForm />} />
                <Route path=":usedAccessoryId" element={<UsedAccessoryForm />} />
              </Route>

              <Route path="guideMachines" element={<GuideMachines />}>
                <Route index element={<GuideMachineForm />} />
                <Route path=":guideMachineId" element={<GuideMachineForm />} />
              </Route>

              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId/edit" element={<EditProfile />} />

            </Route>

            <Route path="/admin" element={<PrivateRoute roles={['ROLE_ADMIN']}><Admin /></PrivateRoute>} >
              <Route index element={<AdminHome />} />
              <Route path="trash" element={<Trash />} />

              <Route path="users" element={<Users />}>
                <Route index element={<UserList />} />
                <Route path=":userId" element={<UserForm />} />
              </Route>

            </Route>

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
          <ToastContainer/>
          {isAuthenticated && <ChatWidget />}
    </>
  );
}

export default function App() {

  const [contextTokenPayload, setContextTokenPayload] = useState<AccessTokenPayloadDTO>();

  useEffect(() => {

    if (authService.isAuthenticated()) {
      const payload = authService.getAccessTokenPayload();
      setContextTokenPayload(payload);
    }
  }, []);

  return (
    <ContextToken.Provider value={{ contextTokenPayload, setContextTokenPayload }}>
        <HistoryRouter history={history}>
          <AppContent />
        </HistoryRouter>
    </ContextToken.Provider>
  );
}
