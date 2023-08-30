import LeftSideMenu from "../../components/leftSide-menu/LeftSideMenu";


function ItMenu() {
  const menu = ["echipament", "necesar", "predare", "retur", "facturi"];

  return (
    <div className="it-page">
      <LeftSideMenu menu={menu} />
    </div>
  );
}

export default ItMenu;
