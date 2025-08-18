import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom"
// form
import { ButtonGhost, ButtonIcon, ButtonOutline, ButtonOutlineDanger, ButtonPrimary } from "@/components/Button";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useSpinner from "@/hooks/useSpinner";
import { Color } from "@/enums/enum";
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";
import { HeaderLabel } from "@/components/HeaderSection";
import { Globe, MousePointerClick, ShieldCheck, Text, Type, Wallet, Clock, GripVertical, Trash2, ListFilter } from "lucide-react";
import Collapse from "@/components/Collapse";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ScriptContainer = ({ children, ...other }) => {
  return (
    <div className="script-container d-flex justify-content-between" {...other}>
      {children}
    </div>
  )
}

const NavActions = ({ children, ...other }) => {
  return (
    <div className="nav-actions" {...other} style={{ flex: '0 0 18%' }}>
      {children}
    </div>
  )
}

const MainLogic = ({ children, ...other }) => {
  return (
    <div className="main-logic" {...other} style={{ flex: '1' }}>
      {children}
    </div>
  )
}

const Properties = ({ children, ...other }) => {
  return (
    <div className="properties" {...other} style={{ flex: '0 0 25%' }}>
      {children}
    </div>
  )
}

const Actions = ({ actionData = [], onAddAction }) => {
  return (
    <div className="mt-20">
      {actionData.map(({ label, children }) => (
        <Collapse
          key={label}
          label={label}
          content={
            children.map((item) => (
              <ActionChildrenItem
                onAddAction={() => onAddAction(item)}
                item={item}
                key={item.type}
              />
            ))}
        />
      ))}
    </div>
  )
}

const ActionChildrenItem = ({ item, onAddAction = () => { }, ...other }) => {
  return (
    <div
      onClick={onAddAction}
      className="d-flex fw-400 gap-8 ms-7 select-none pointer align-items-center action-item"
      {...other}
    >
      {item.icon}
      <p>{item.name}</p>
    </div>
  )
}

const ActionLogicItem = ({ item, ...other }) => {
  return (
    <div className='d-flex gap-20'>
      <div className="d-flex fs-14 fw-400 gap-10 pointer select-none main-logic-item-action align-items-center" {...other}>
        <GripVertical className='select-none drag-logic' color='#A8A8A8' size={'17px'} />
        {item.icon}
        <p>{item.logicName}</p>
      </div>

      <span className='text-gray text-too-long-450 fw-500'>
        {item.placeholder({ formData: item.formData })}
      </span>
    </div>
  )
}

const UnderlineHeader = ({ ...other }) => {
  return (
    <div className="underline-header-script" {...other} />
  )
}

export default function ScriptNewEditDetails({
  currentLogicItems = [],
  onUpdateData,
  actionData = [],

}) {
  const [formAction, setFormAction] = useState(null);
  const [isRemoveLogicItem, setIsRemoveLogicItem] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updated = Array.from(currentLogicItems);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    onUpdateData(updated);
  };

  const handleAddLogic = (item) => {
    const uniqueId = `${item.type}-${Date.now()}-${Math.random()}`;

    const logicItem = {
      ...item,
      id: uniqueId,
    }
    onUpdateData([...currentLogicItems, logicItem]);
  };

  const handleUpdateLogic = (data) => {
    onUpdateData((prev) =>
      prev.map((item) =>
        item.id === data.id
          ? { ...item, formData: data.formData, code: data.code }
          : item
      )
    );
  };

  const handleClick = (event) => {
    const rows = document.querySelectorAll('.main-logic-item');
    rows.forEach((row) => row.classList.remove('active-logic'));

    const rowElement = event.target.closest('.main-logic-item');
    if (rowElement) {
      rowElement.classList.add('active-logic');
    }
  };

  const handleSetFormAction = (e, id, form) => {
    handleClick(e);
    setFormAction({ id, form });
  }

  useEffect(() => {
    if (isRemoveLogicItem) {

      if (!formAction) {
        return;
      }

      const formActionInList = currentLogicItems.some((item) => item.id === formAction.id);

      if (!formActionInList) {
        setFormAction(null);
      }

      setIsRemoveLogicItem(false);
    }
  }, [isRemoveLogicItem, currentLogicItems, formAction])

  const handleRemoveLogic = (e, id) => {
    e.stopPropagation();

    const filtered = currentLogicItems.filter((item) => item.id !== id);
    onUpdateData(filtered)

    setIsRemoveLogicItem(true);
  };

  const handleClearLogicItems = () => {
    setFormAction(null);
    onUpdateData([]);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <ScriptContainer>

          <NavActions>
            <HeaderLabel heading={'Hành động'} />
            <UnderlineHeader />

            <Actions actionData={actionData} onAddAction={handleAddLogic} />
          </NavActions>

          <MainLogic>
            <div className='d-flex justify-content-between align-items-center'>
              <HeaderLabel heading={'Logic kịch bản'} />

              {currentLogicItems.length > 0 &&
                <div
                  className='d-flex align-items-center gap-7 script-clear-icon'
                  onClick={handleClearLogicItems}
                >
                  <ListFilter
                    color={Color.ORANGE}
                    size='13px'
                  />
                  <span className='fw-400 fs-14' style={{ color: Color.ORANGE }}>
                    Clear
                  </span>
                </div>
              }
            </div>
            <UnderlineHeader />

            <div className="mt-20">
              <Droppable droppableId="main-logic">
                {(prov) => (
                  <div {...prov.droppableProps} ref={prov.innerRef}>
                    {currentLogicItems.map((item, idx) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={idx}
                      >
                        {(prov) => (
                          <div
                            onClick={(e) => handleSetFormAction(
                              e,
                              item.id,
                              <item.formComponent
                                key={item.id}
                                id={item.id}
                                formData={item.formData}
                                buildCode={item.buildCode}
                                onUpdateLogic={handleUpdateLogic}
                              />
                            )}
                            // lag click faster luc nao lam thu xem co thay kho chiu ko
                            className={`main-logic-item mt-7 pointer justify-content-between d-flex fs-14 fw-400 gap-10 select-none align-items-center`}
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                          >
                            <ActionLogicItem item={item} key={item.id} />

                            <ButtonIcon
                              onClick={(e) => handleRemoveLogic(e, item.id)}
                              variant='ghost'
                              icon={<Trash2 color={Color.DANGER} />}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {prov.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </MainLogic>

          <Properties>
            <HeaderLabel heading={'Thuộc tính'} />
            <UnderlineHeader />

            <div className="mt-15">
              {formAction && formAction.form}
            </div>
          </Properties>

        </ScriptContainer>
      </DragDropContext>
    </>
  )
}

