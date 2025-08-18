import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
// form
import { apiGet } from "@/utils/axios";
import useSpinner from "@/hooks/useSpinner";
import Page from "@/components/Page";
import Container from "@/components/Container";
import { HeaderAction, HeaderBack, HeaderBreadcrumbs } from "@/components/HeaderSection";
import { PATH_DASHBOARD } from "@/routes/path";
import ScriptNewEditDetails from './ScriptNewEditDetails';
import { delayApi } from '@/utils/commonUtil';
import { ButtonIcon, ButtonOutline, ButtonOutlinePrimary, ButtonPrimary } from '@/components/Button';
import { ChevronLeft, Play, Save } from 'lucide-react';
import Modal from '@/components/Modal';
import ScriptNewEditForm from './ScriptNewEditForm';
import useMessage from '@/hooks/useMessage';
import { PAGE_ACTION_DATA } from './actions-form/page/PageActionData';
import { CLICK_ACTION_DATA } from './actions-form/click/ClickActionData';
import ScriptRunTest from './ScriptRunTest';

const ScriptNewEditDetailsMemo = React.memo(ScriptNewEditDetails);

const ACTIONS_DATA = [
  ...PAGE_ACTION_DATA,
  ...CLICK_ACTION_DATA,
]

export default function ScriptNewEdit() {

  const { fileName } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes('edit');
  const [data, setData] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();
  const [openModal, setOpenModal] = useState(false);
  const [openModalRunTest, setOpenModalRunTest] = useState(false);

  const handleUpdateLogicItemsFromRes = (logicItems = []) => {
    const ACTIONS_DATA_FLAT = ACTIONS_DATA.flatMap(group => group.children);

    const mergedLogicItems = logicItems.map(item => {
      const actionItem = ACTIONS_DATA_FLAT.find(action => action.type === item.type);

      if (!actionItem) return item;

      return {
        ...actionItem,
        id: item.id,
        type: item.type,
        formData: item.formData,
        code: actionItem.buildCode({ ...item.formData }),
      };
    });

    return mergedLogicItems;
  }

  useEffect(() => {
    const fetch = async () => {
      onOpen();
      try {
        const response = await apiGet(`/scripts/${fileName}`);
        delayApi(() => {
          const res = response.data.data;
          const logicItems = res.logicItems;
          const updatedLogicItems = handleUpdateLogicItemsFromRes(logicItems);
          const data = {
            ...res,
            logicItems: updatedLogicItems,
            code: getAllCode(updatedLogicItems),
          }

          setData(data || []);
          console.log(data);
          onClose();
        })
      } catch (error) {
        console.error(error);
        onError(error.message)
        onClose();
      }
    }

    if (isEdit) {
      fetch();
    }
  }, [fileName]) // nagivate

  const getAllCode = (logicItems) => logicItems
    ?.map(item => item.code)
    ?.join('\n\n');

  const handleUpdateLogicItems = useCallback((updater) => {
    setData(prev => {
      const newLogicItems =
        typeof updater === "function" ? updater(prev.logicItems) : updater;

      return {
        ...prev,
        logicItems: newLogicItems,
        code: getAllCode(newLogicItems),
      };
    });
  }, []);

  const runScriptTest = async () => {
    const params = {
      code: data.code,
    }

    try {
      onOpen();
      const response = await apiGet(`/scripts/run-script/test`, params);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const handleRunTestScript = () => {
    const hasLogicItems = data?.logicItems?.length > 0;

    if (!hasLogicItems) {
      return;
    }

    runScriptTest();
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleClose = () => {
    setOpenModal(false);
  }

  const handleOpenModalRunTest = () => {
    setOpenModalRunTest(true);
  }

  const handleCloseModalRunTest = () => {
    setOpenModalRunTest(false);
  }

  return (
    <Page title='Quản lý kịch bản - AirdropHub'>
      <Container>
        <div className='d-flex justify-content-between'>
          <HeaderBack heading={'Tạo Kịch Bản'} url={PATH_DASHBOARD.script.list} />

          <div className='d-flex gap-10'>
            <ButtonOutlinePrimary
              icon={<Play />}
              title='Chạy thử'
              onClick={handleOpenModalRunTest}
            />
            <ButtonPrimary
              icon={<Save />}
              title='Lưu kịch bản'
              onClick={handleOpenModal}
            />
          </div>
        </div>

        <Modal
          size='md'
          isOpen={openModalRunTest}
          onClose={handleCloseModalRunTest}
          title={"Chạy thử kịch bản"}
          content={
            <ScriptRunTest
              currentScript={data}
              onCloseModal={handleCloseModalRunTest}
              isEdit={isEdit}
            />
          }
        />

        <Modal
          size='md'
          isOpen={openModal}
          onClose={handleClose}
          title={"Lưu kịch bản"}
          content={
            <ScriptNewEditForm
              currentScript={data}
              onCloseModal={handleClose}
              isEdit={isEdit}
            />
          }
        />

        <ScriptNewEditDetailsMemo
          currentLogicItems={data.logicItems || []}
          onUpdateData={handleUpdateLogicItems}
          actionData={ACTIONS_DATA}
        />

      </Container>
    </Page>

  )
}

