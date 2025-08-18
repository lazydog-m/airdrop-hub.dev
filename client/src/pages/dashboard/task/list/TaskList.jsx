import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { CURRENT_DATA_TYPE, TaskRank, WalletStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import TaskNewEditForm from '../create/TaskNewEditForm';
import TaskDataTable from './TaskDataTable';
import Editor from '@/components/Editor';
import { Link } from 'react-router-dom';
import { PATH_DASHBOARD } from '@/routes/path';
import Select from '@/components/Select';
import { delayApi } from '@/utils/commonUtil';
export default function TaskList() {
  const [data, setData] = useState([]);
  const { onOpen, onClose } = useSpinner();

  useEffect(() => {
    const fetch = async () => {
      try {
        onOpen();
        const response = await apiGet("/tasks");
        // setData(response.data.data || []);

        delayApi(() => {
          console.log(response.data);
          setData(response.data.data || []);
          onClose();
        })
      } catch (error) {
        console.error(error);
        onClose();
      }
    }

    fetch();
  }, [])

  const handleUpdateData = (newData) => {
    setData(newData);
  }

  const handleUpdateRow = (taskNew) => {
    setData((prevData) =>
      prevData.map((task) =>
        task.id === taskNew.id ? taskNew : task
      )
    );
  };

  const handleDeleteData = (id) => {
    setData((prevData) =>
      prevData.filter((task) =>
        task.id !== id
      )
    );
  }

  return (
    <Page title='Quản lý công việc - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách công việc'
          action={
            <Link to={PATH_DASHBOARD.task.create}>
              <ButtonPrimary
                icon={<CirclePlus />}
                title='Thêm mới'
              />
            </Link>
          }
        />

        <TaskDataTable data={data} onUpdateData={handleUpdateData} onUpdateRow={handleUpdateRow} onDeleteData={handleDeleteData} />

      </Container>
    </Page>
  )
}
