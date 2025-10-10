import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
// form
import { apiGet } from "@/utils/axios";
import useSpinner from "@/hooks/useSpinner";
import Page from "@/components/Page";
import Container from "@/components/Container";
import { HeaderBack } from "@/components/HeaderSection";
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

    <Page title='Quản lý công việc' className='color-white'>
      <Container
        style={{ width: '65%', margin: '0 auto' }} // make util
      >
        <HeaderBack
          heading={
            isEdit ? `Cập nhật công việc` : `Tạo công việc`
          }
          url={PATH_DASHBOARD.task.list}
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

