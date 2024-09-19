import {
  Grid,
  Container,
  createStyles,
  Text,
  Stack,
  Title,
  Loader,
  Flex,
  Card,
  Button,
  Progress,
  Divider,
  Group,
  Menu,
  Rating,
  Modal,
  Space,
  Paper,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  CourseGetDto,
  ApiResponse,
  ReviewGetDto,
  UserDto,
} from "../../constants/types";
import { useCallback, useEffect, useState } from "react";
import api from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPenToSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../routes";
import { DeleteModal } from "../../components/delete-modal";

//This is a basic Component, and since it is used inside of
//'../../routes/config.tsx' line 31, that also makes it a page
export const CoursePage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const dateFormat = (date) => {
    const time = new Date(date);
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [course, setCourse] = useState<CourseGetDto>();
  const [reviews, setReviews] = useState<ReviewGetDto[]>([]);
  const [currentUser, setCurrentUser] = useState<UserDto>();
  const { id } = useParams();
  const [forceReload, setForceReload] = useState(0);

  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);

  const determinPercentage = (stars) => {
    console.log(fiveStar);
    return (stars / reviews?.length) * 100;
  };
  const [overallRating, setOverallRating] = useState(0);
  const [opened, setOpened] = useState(false);
  const [currentDelete, setCurrentDelete] = useState(0);

  const deleteReview = useCallback(
    async (reviewId: number) => {
      const response = await api.delete<ApiResponse<ReviewGetDto>>(
        `/api/reviews/${reviewId}`
      );

      if (response.data.hasErrors) {
        showNotification({ message: "Error deleting review.", color: "red" });
      }

      await fetchReviews();
    },
    [id]
  );

  async function fetchCourse() {
    const response = await api.get<ApiResponse<CourseGetDto>>(
      `/api/courses/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error finding course", color: "red" });
    }
    if (response.data.data) {
      setCourse(response.data.data);
      console.log(response.data.data);
    }
  }

  async function fetchReviews() {
    const response = await api.get<ApiResponse<ReviewGetDto[]>>(
      `/api/reviews/course/${id}`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error finding reviews", color: "red" });
    }
    if (response.data.data) {
      const reviews = response.data.data;
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = reviews.length ? totalRating / reviews.length : 0;
      setOverallRating(parseFloat((averageRating / 10).toFixed(1)));

      let countFiveToFour = 0;
      let countFourToThree = 0;
      let countThreeToTwo = 0;
      let countTwoToOne = 0;
      let countOneToZero = 0;

      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].rating > 40 && reviews[i].rating <= 50) {
          countFiveToFour++;
        }
        if (reviews[i].rating > 30 && reviews[i].rating <= 45) {
          countFourToThree++;
        }
        if (reviews[i].rating > 20 && reviews[i].rating <= 30) {
          countThreeToTwo++;
        }
        if (reviews[i].rating > 10 && reviews[i].rating <= 20) {
          countTwoToOne++;
        }
        if (reviews[i].rating > 0 && reviews[i].rating <= 10) {
          countOneToZero++;
        }
      }
      setFiveStar(countFiveToFour);
      setFourStar(countFourToThree);
      setThreeStar(countThreeToTwo);
      setTwoStar(countTwoToOne);
      setOneStar(countOneToZero);
      setReviews(reviews.reverse());
      console.log(response.data.data);
    }
  }

  async function fetchCurrentUser() {
    const response = await api.get<ApiResponse<UserDto>>(
      `/api/get-current-user`
    );

    if (response.data.hasErrors) {
      showNotification({ message: "Error finding course", color: "red" });
    }
    if (response.data.data) {
      setCurrentUser(response.data.data);
      console.log(response.data.data);
    }
  }

  useEffect(() => {
    fetchCourse();
    fetchReviews();
    fetchCurrentUser();
  }, [id, forceReload]);

  return (
    <Container>
      {course && reviews ? (
        <Container>
          <Title order={1}>{course.name}</Title>
          <Space h={10} />
          <Card style={{ padding: 30 }}>
            <Grid>
              <Grid.Col span={6}>
                <Stack>
                  <Text>
                    <span className={classes.ratingText}>{overallRating}</span>{" "}
                    / 5
                    <Text className={classes.mediumText}>
                      Based off of {reviews.length} reviews
                    </Text>
                  </Text>
                  <div>
                    <Button
                      radius="xl"
                      size="lg"
                      onClick={() => {
                        navigate(routes.courseReview.replace(":id", `${id}`));
                      }}
                      rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
                    >
                      Rate
                    </Button>
                  </div>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text weight="bold" size="lg">
                  Rating Distribution
                </Text>
                <Stack>
                  <Grid justify="center">
                    <Grid.Col span={3}>
                      <span style={{ fontWeight: "bold" }}>5 star</span>
                    </Grid.Col>
                    <Grid.Col span={7}>
                      <Progress
                        value={determinPercentage(fiveStar)}
                        mt="md"
                        size="lg"
                        radius="xl"
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>{fiveStar}</Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={3}>
                      <span style={{ fontWeight: "bold" }}>4 star</span>
                    </Grid.Col>
                    <Grid.Col span={7}>
                      <Progress
                        value={determinPercentage(fourStar)}
                        mt="md"
                        size="lg"
                        radius="xl"
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>{fourStar}</Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={3}>
                      <span style={{ fontWeight: "bold" }}>3 star</span>
                    </Grid.Col>
                    <Grid.Col span={7}>
                      <Progress
                        value={determinPercentage(threeStar)}
                        mt="md"
                        size="lg"
                        radius="xl"
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>{threeStar}</Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={3}>
                      <span style={{ fontWeight: "bold" }}>2 star</span>
                    </Grid.Col>
                    <Grid.Col span={7}>
                      <Progress
                        value={determinPercentage(twoStar)}
                        mt="md"
                        size="lg"
                        radius="xl"
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>{twoStar}</Grid.Col>
                  </Grid>
                  <Grid>
                    <Grid.Col span={3}>
                      <span style={{ fontWeight: "bold" }}>1 star</span>
                    </Grid.Col>
                    <Grid.Col span={7}>
                      <Progress
                        value={determinPercentage(oneStar)}
                        mt="md"
                        size="lg"
                        radius="xl"
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>{oneStar}</Grid.Col>
                  </Grid>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
          <Divider />
          <Container />

          <Space h={7} />

          <Container>
            <Stack spacing={1}>
              {reviews?.map((review) => {
                return (
                  <Card shadow="md" mt="lg" style={{ padding: 30 }}>
                    <Card.Section inheritPadding>
                      <Flex justify={"space-between"}>
                        {currentUser?.id === review.userId && (
                          <Text fz="sm">Posted by you</Text>
                        )}

                        <Text align="right" fz="sm">
                          {dateFormat(review.dateCreated)}
                        </Text>
                      </Flex>

                      <Space h={7} />

                      <Card.Section inheritPadding>
                        <Flex direction={"row"} justify={"space-between"}>
                          <Flex direction={"row"} justify={"left"}>
                            <Group>
                              <Text weight="bold">{review.professorName}</Text>

                              <Rating
                                fractions={2}
                                size="xl"
                                value={review.rating / 10}
                                readOnly
                              />
                            </Group>
                          </Flex>

                          <Flex direction={"row"} justify={"right"}>
                            <FontAwesomeIcon
                              className={classes.iconButton}
                              icon={faPenToSquare}
                              onClick={() => {
                                navigate(
                                  routes.courseReviewUpdate
                                    .replace(":review", `${review.id}`)
                                    .replace(":id", `${id}`)
                                );
                              }}
                            />

                            <Space w={7} />
                            <DeleteModal
                              text={`Are you sure you want to delete this review?`}
                              onDelete={() => deleteReview(review.id)}
                            />
                          </Flex>
                        </Flex>
                      </Card.Section>
                    </Card.Section>
                    <Card.Section inheritPadding py="lg">
                      <Text>{review.comment}</Text>
                    </Card.Section>
                  </Card>
                );
              })}
            </Stack>
          </Container>
        </Container>
      ) : (
        <>
          <Loader />
        </>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    homePageContainer: {
      display: "flex",
      justifyContent: "center",
    },
    ratingText: {
      fontSize: 52,
      fontWeight: "bold",
    },
    mediumText: {
      fontSize: 18,
    },
    iconButton: {
      cursor: "pointer",
    },
  };
});
