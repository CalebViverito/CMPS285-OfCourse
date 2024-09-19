import { FormErrors, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { ApiResponse, CourseCreateUpdateDto, CourseGetDto, DepartmentGetDto } from "../../constants/types";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { routes } from "../../routes";
import { Container, TextInput, Space, Flex, Button, Select, Title } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

export const CourseCreate = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<DepartmentGetDto[]>();
    const mantineForm = useForm<CourseCreateUpdateDto>({
      initialValues: {
        name: "",
        description: "",
        departmentId: 0,
      },
    });

    const fetchDepartments = useCallback (async () => {
        const response = await api.get<ApiResponse<DepartmentGetDto[]>>("/api/departments");
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching departments." });
        }
    
        if (response.data.data) {
          setDepartments(response.data.data);
        }
      }, []);

      useEffect(() => {
        fetchDepartments();
      }, []);

    const submitCourse = async (values: CourseCreateUpdateDto) => {
        const response = await api.post<ApiResponse<CourseGetDto>>(
            "/api/courses",
            values
        );

        if (response.data.hasErrors) {
            const formErrors: FormErrors = response.data.errors.reduce(
                (prev, curr) => {
                    Object.assign(prev, {[curr.property]: curr.message });
                    return prev;
                },
            {} as FormErrors
            );
            mantineForm.setErrors(formErrors);
        }

        if (response.data.data) {
            showNotification({message: "Course created.", color: "green"});
            navigate(routes.course.replace(":id", `${response.data.data.id}`));
        }
    };

    return(<Container>
        <form onSubmit={mantineForm.onSubmit(submitCourse)}>
          <TextInput
            {...mantineForm.getInputProps("name")}
            label="Name"
            withAsterisk
          />
  
          <TextInput
            {...mantineForm.getInputProps("description")}
            label="Description"
            withAsterisk
          />

<Space h={7} />
<Title order ={4}>Select a department for the course</Title>

      <Space h={7} />
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
                navigate(routes.professorListing);
              }}
              variant="outline"
              color="red"
            >
              Cancel
            </Button>
          </Flex>
        </form>
      </Container>)
    
}