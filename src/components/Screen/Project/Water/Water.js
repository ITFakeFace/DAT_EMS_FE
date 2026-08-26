import React, { useState } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuDroplet,
  LuPlus,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { waterDiagramData } from "../../../Data/Data";
import "./Water.scss";

function TreeNode({ node, isRoot = false, onOpenModal, navigate, lang }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div
      className={`DAT_Water_Branch ${isRoot ? "DAT_Water_Branch_Root" : ""}`}
    >
      <div className="DAT_Water_Branch_NodeWrapper">
        {!isRoot && (
          <div className="DAT_Water_Branch_NodeWrapper_ChildLabel">
            {node.data.title}
          </div>
        )}

        <div
          className="DAT_Water_Branch_NodeWrapper_Card"
          onClick={() => navigate(`/water/${node.id}`)}
        >
          {isRoot ? (
            <div className="DAT_Water_Branch_NodeWrapper_Card_HeaderRoot">
              <h4>{node.data.title}</h4>
              <div className="DAT_Water_Branch_NodeWrapper_Card_Actions">
                <button
                  type="button"
                  title={lang.formatMessage({
                    id: "project_monitor_add_child",
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal("add", node.id, node.data.title);
                  }}
                >
                  <LuPlus />
                </button>
                <button
                  type="button"
                  className="DAT_Water_Branch_NodeWrapper_Card_Actions_Delete"
                  title={lang.formatMessage({ id: "water_delete_root" })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal("delete", node.id, node.data.title);
                  }}
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          ) : (
            <div className="DAT_Water_Branch_NodeWrapper_Card_HeaderSub">
              <div className="DAT_Water_Branch_NodeWrapper_Card_Actions">
                <button
                  type="button"
                  title={lang.formatMessage({
                    id: "project_monitor_add_child",
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal("add", node.id, node.data.title);
                  }}
                >
                  <LuPlus />
                </button>
                <button
                  type="button"
                  className="DAT_Water_Branch_NodeWrapper_Card_Actions_Delete"
                  title={lang.formatMessage({
                    id: "project_monitor_delete_station",
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal("delete", node.id, node.data.title);
                  }}
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          )}

          <div className="DAT_Water_Branch_NodeWrapper_Card_Body">
            {node.data.metrics.map((m, i) => (
              <p key={i}>
                <span>
                  {lang.formatMessage({
                    id: i === 0 ? "water_metric_total" : "water_metric_flow",
                  })}
                </span>
                <strong>
                  {m.value} {m.unit}
                </strong>
              </p>
            ))}
          </div>
        </div>

        {hasChildren && (
          <button
            type="button"
            className="DAT_Water_Branch_NodeWrapper_Toggler"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <LuChevronDown /> : <LuChevronUp />}
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <>
          <div className="DAT_Water_Branch_LineDown" />
          <div className="DAT_Water_Branch_ChildrenWrap">
            <div className="DAT_Water_Branch_ChildrenWrap_Grid">
              {node.children.map((child, idx) => (
                <div
                  key={child.id || idx}
                  className="DAT_Water_Branch_ChildrenWrap_Grid_Col"
                >
                  <div className="DAT_Water_Branch_ChildrenWrap_Grid_Col_LineUp" />
                  <TreeNode
                    node={child}
                    onOpenModal={onOpenModal}
                    navigate={navigate}
                    lang={lang}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Water() {
  const lang = useIntl();
  const navigate = useNavigate();
  const [treeList, setTreeList] = useState(waterDiagramData || []);
  const [currentPage, setCurrentPage] = useState(0);

  const [modal, setModal] = useState(null);
  const [inputVal, setInputVal] = useState("");

  const totalPages = treeList.length;
  const currentTree = treeList[currentPage];

  const closeModal = () => {
    setModal(null);
    setInputVal("");
  };

  const openModal = (type, id = null, title = "") => {
    setInputVal("");
    setModal({ type, id, title });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newNode = {
      id: Date.now(),
      data: {
        title: inputVal.trim().toUpperCase(),
        metrics: [
          { label: "TỔNG TIÊU THỤ:", value: "0", unit: "m³" },
          { label: "LƯU LƯỢNG:", value: "0.0", unit: "m³/h" },
        ],
      },
      children: [],
    };

    if (modal.type === "add-root") {
      setTreeList((prev) => [...prev, newNode]);
      setCurrentPage(totalPages);
    } else {
      const add = (n) =>
        n.id === modal.id
          ? { ...n, children: [...(n.children || []), newNode] }
          : { ...n, children: n.children?.map(add) || [] };

      setTreeList((prev) =>
        prev.map((tree, i) => (i === currentPage ? add(tree) : tree)),
      );
    }
    closeModal();
  };

  const handleDeleteSubmit = () => {
    const isRoot = currentTree?.id === modal.id;

    if (isRoot) {
      setTreeList((prev) => {
        const next = prev.filter((t) => t.id !== modal.id);
        setCurrentPage((p) => Math.min(p, Math.max(0, next.length - 1)));
        return next;
      });
    } else {
      const remove = (n) => ({
        ...n,
        children: (n.children || [])
          .filter((c) => c.id !== modal.id)
          .map(remove),
      });
      setTreeList((prev) =>
        prev.map((tree, i) => (i === currentPage ? remove(tree) : tree)),
      );
    }
    closeModal();
  };

  return (
    <div className="DAT_Water">
      {/* Tag hệ thống nằm ngoài góc trái */}
      <div className="DAT_Water_TextHeader">
        <button
          className="DAT_Water_TextHeader_BackBtn"
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <div className="DAT_Water_TextHeader_SystemTag">
          <LuDroplet />{" "}
          <span>{lang.formatMessage({ id: "water_system_title" })}</span>
        </div>
      </div>

      {/* Nút tạo trạm góc phải */}
      <div className="DAT_Water_TopBar">
        <button
          type="button"
          className="DAT_Water_TopBar_AddRootBtn"
          onClick={() => openModal("add-root", null, "TRẠM TỔNG NƯỚC")}
        >
          <LuPlus />{" "}
          <span>{lang.formatMessage({ id: "water_create_root" })}</span>
        </button>
      </div>

      {/* Sơ đồ hệ thống nước */}
      <div className="DAT_Water_CanvasWrap">
        <div className="DAT_Water_CanvasWrap_NavSlot">
          <button
            type="button"
            className="DAT_Water_CanvasWrap_NavSlot_NavBtn"
            disabled={totalPages === 0}
            onClick={() =>
              setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1))
            }
          >
            <LuChevronLeft />
          </button>
        </div>

        <div className="DAT_Water_CanvasWrap_ScrollContainer">
          <div className="DAT_Water_CanvasWrap_ScrollContainer_MainBoard">
            <div className="DAT_Water_CanvasWrap_ScrollContainer_MainBoard_Canvas">
              {currentTree && (
                <TreeNode
                  key={currentTree.id || currentPage}
                  node={currentTree}
                  isRoot
                  onOpenModal={openModal}
                  navigate={navigate}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>

        <div className="DAT_Water_CanvasWrap_NavSlot">
          <button
            type="button"
            className="DAT_Water_CanvasWrap_NavSlot_NavBtn"
            disabled={totalPages === 0}
            onClick={() =>
              setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : 0))
            }
          >
            <LuChevronRight />
          </button>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="DAT_Water_PageIndicator">
          {currentPage + 1}/{totalPages}
        </div>
      )}

      {/* Modal CRUD */}
      {modal && (
        <div className="DAT_Water_ModalOverlay" onClick={closeModal}>
          <div
            className="DAT_Water_ModalOverlay_Modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="DAT_Water_ModalOverlay_Modal_Header">
              <h3>
                {modal.type === "delete"
                  ? lang.formatMessage({ id: "project_monitor_confirm_delete" })
                  : modal.type === "add-root"
                    ? lang.formatMessage({ id: "water_create_root_title" })
                    : lang.formatMessage(
                        { id: "project_monitor_add_child_for" },
                        { title: modal.title },
                      )}
              </h3>
              <button type="button" onClick={closeModal}>
                <LuX />
              </button>
            </div>

            {modal.type === "delete" ? (
              <div>
                <div className="DAT_Water_ModalOverlay_Modal_Body">
                  <p>
                    {lang.formatMessage(
                      { id: "project_monitor_delete_message" },
                      { title: modal.title },
                    )}
                  </p>
                </div>
                <div className="DAT_Water_ModalOverlay_Modal_Footer">
                  <button
                    type="button"
                    className="DAT_Water_ModalOverlay_Modal_Footer_BtnCancel"
                    onClick={closeModal}
                  >
                    {lang.formatMessage({ id: "project_monitor_cancel" })}
                  </button>
                  <button
                    type="button"
                    className="DAT_Water_ModalOverlay_Modal_Footer_BtnDelete"
                    onClick={handleDeleteSubmit}
                  >
                    {lang.formatMessage({ id: "project_monitor_delete_now" })}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit}>
                <div className="DAT_Water_ModalOverlay_Modal_Body">
                  <label>
                    {modal.type === "add-root"
                      ? lang.formatMessage({ id: "water_root_name" })
                      : lang.formatMessage({
                          id: "project_monitor_child_station_name",
                        })}
                  </label>
                  <input
                    autoFocus
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={
                      modal.type === "add-root"
                        ? lang.formatMessage({ id: "water_root_placeholder" })
                        : lang.formatMessage({ id: "water_child_placeholder" })
                    }
                  />
                </div>
                <div className="DAT_Water_ModalOverlay_Modal_Footer">
                  <button
                    type="button"
                    className="DAT_Water_ModalOverlay_Modal_Footer_BtnCancel"
                    onClick={closeModal}
                  >
                    {lang.formatMessage({ id: "project_monitor_cancel" })}
                  </button>
                  <button
                    type="submit"
                    className="DAT_Water_ModalOverlay_Modal_Footer_BtnSubmit"
                  >
                    {lang.formatMessage({ id: "project_monitor_confirm" })}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
