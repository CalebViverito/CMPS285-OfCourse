import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Flex,
  Modal,
  Space,
  Title,
  createStyles,
} from "@mantine/core";
import { useState } from "react";

type DeleteModalProps = {
  onDelete: () => Promise<void>;
  text: string;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({ onDelete, text }) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState(false);

  async function onAccept() {
    await onDelete();
    setOpen(false);
  }

  return (
    <>
      <FontAwesomeIcon
        className={classes.iconButton}
        icon={faTrash}
        color="#f03e3e"
        onClick={() => setOpen(true)}
      />

      <Modal opened={open} onClose={() => setOpen(false)}>
        <Container>
          <Title order={5}>{text}</Title>
        </Container>

        <Space h={18} />

        <Flex direction={"row"} justify={"right"}>
          <Button onClick={onAccept} color="red">
            Delete
          </Button>

          <Space w={7} />

          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },
  };
});