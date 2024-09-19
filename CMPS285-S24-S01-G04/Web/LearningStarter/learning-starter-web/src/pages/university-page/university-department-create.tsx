import { useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UniversityGetDto, DepartmentGetDto, UniversityDepartmentCreateUpdateDto, ApiResponse, UniversityDepartmentGetDto } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { routes } from "../../routes";
import { Container, Title, Space, Select, Flex, Button } from "@mantine/core";

export const UniversityDepartmentCreate = () => {
    const [university, setUniversity] = useState<UniversityGetDto>();
    const [departments, setDepartments] = useState<DepartmentGetDto[]>();
    const { id } = useParams();
    const navigate = useNavigate();
  
    const mantineForm = useForm<UniversityDepartmentCreateUpdateDto>({
      initialValues: {
        universityId: Number(id),
        departmentId: 0,
      },
    });

    const fetchUniversity = useCallback(async () => {
        const response = await api.get<ApiResponse<UniversityGetDto>>(
          `/api/universities/${id}`
        );
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching university." });
        }
    
        if (response.data.data) {
          setUniversity(response.data.data);
        }
      }, [id]);
    
      const fetchDepartments = useCallback(async () => {
        const response = await api.get<ApiResponse<DepartmentGetDto[]>>(
          "/api/departments"
        );
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching courses." });
        }
    
        if (response.data.data) {
          setDepartments(response.data.data);
        }
      }, []);
    
      useEffect(() => {
        fetchDepartments();
        fetchUniversity();
      }, []);

      const submitUniversityDepartment = async (
        values: UniversityDepartmentCreateUpdateDto
      ) => {
        const response = await api.post<ApiResponse<UniversityDepartmentGetDto>>(
          `/api/universities/${id}/department/${mantineForm.values.departmentId}`,
          values
        );
    
        if (response.data.hasErrors) {
          showNotification({
            message: `${university?.name} already has that department.`,
            color: "red",
          });
        }
    
        if (response.data.data) {
          showNotification({
            message: "Department added",
            color: "green",
          });
          navigate(routes.universityDetails.replace(":id", `${id}`));
        }
      };


    return(<Container>
        <Title order={3}>
          Select a department for {university?.name}
        </Title>
  
        <Space h={7} />
  
        <form onSubmit={mantineForm.onSubmit(submitUniversityDepartment)}>
          {departments && (
            <Select
              {...mantineForm.getInputProps("departmentId")}
              data={departments.map((department) => {
                return {
                  label: department.name,
                  value: String(department.id),
                };
              })}
            />
          )}
  
          <Space h={18} />
  
          <Flex direction={"row"}>
            <Button type="submit">Submit</Button>
            <Space w={7} />
            <Button
              type="button"
              onClick={() => {
                navigate(
                  routes.universityDetails.replace(":id", `${university?.id}`)
                );
              }}
              variant="outline"
              color="red"
            >
              Cancel
            </Button>
          </Flex>
        </form>
      </Container>)

};


  