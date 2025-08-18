import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
// form
import { apiGet } from "@/utils/axios";
import useSpinner from "@/hooks/useSpinner";
import Page from "@/components/Page";
import Container from "@/components/Container";
import { HeaderAction, HeaderBreadcrumbs } from "@/components/HeaderSection";
import { PATH_DASHBOARD } from "@/routes/path";
import TaskNewEditForm from './TaskNewEditForm';
import { delayApi } from '@/utils/commonUtil';

export default function TaskNewEdit() {

  const { id } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes('edit');
  const [data, setData] = useState({});
  const { onOpen, onClose } = useSpinner();

  useEffect(() => {
    const fetch = async () => {
      try {
        onOpen();
        const response = await apiGet(`/tasks/${id}`);
        delayApi(() => {
          setData(response.data.data || []);
          console.log(response.data);
          onClose();
        })
      } catch (error) {
        console.error(error);
        onClose();
      }
    }

    if (isEdit) {
      fetch();
    }
  }, [id])

  return (

    <Page title='Quản lý công việc - AirdropHub' className='color-white'>
      <Container>
        <HeaderBreadcrumbs
          links={[
            { url: PATH_DASHBOARD.task.list, title: 'Danh sách công việc' }
          ]}
          page={`${isEdit ? 'Cập nhật công việc' : 'Thêm mới công việc'}`}
        />

        <HeaderAction
          style={{ display: 'block', textAlign: 'center', marginTop: '25px' }}
          heading={`${isEdit ? 'Cập nhật công việc' : 'Thêm mới công việc'}`}
        />

        <TaskNewEditForm
          isEdit={isEdit}
          currentTask={data}
          onUpdateData={(data) => setData(data)}
        />

      </Container>
    </Page>

  )
}

