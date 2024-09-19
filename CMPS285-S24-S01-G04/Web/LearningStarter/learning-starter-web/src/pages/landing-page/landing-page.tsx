import {
  Button,
  Container,
  createStyles,
  Space,
  Stack,
  Text,
  Image,
  Flex,
  Table,
  Title,
} from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate } from "react-router-dom";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const LandingPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  return (
    <Container>
      <Stack
        h={300}
        bg="var(--mantine-color-body)"
        align="center"
        justify="center"
      >
        <Space h={120} />
        <Title order={2}>Welcome to OfCourse!</Title>
        <Container h={350} w={450}>
          <Image
            fit="contain"
            radius="md"
            src="https://www.thoughtco.com/thmb/DxY6FajGtwIuqZSYi6w_awZ2Wy8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dv1940073-56a9397e3df78cf772a4ec5c.jpg"
          />
        </Container>

        <Text size="lg">Click the button to start</Text>
        <Button
          size="lg"
          onClick={() => {
            navigate(routes.universityListing);
          }}
        >
          Let's Go!
        </Button>
      </Stack>
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
});
