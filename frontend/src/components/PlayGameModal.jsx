import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Text,
} from "@chakra-ui/react";

const PlayGameModal = ({
  game,
  playDuration,
  setPlayDuration,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal isOpen={!!game} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Play {game?.gameName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text p={2}>How many hours?</Text>
          <Select
            placeholder="Select duration"
            onChange={(e) => setPlayDuration(parseInt(e.target.value))}
            value={playDuration || ""}
          >
            <option value={1}>1 hour</option>
            <option value={3}>3 hours</option>
            <option value={5}>5 hours</option>
            <option value={8}>8 hours</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={onSubmit}>
            Go Online
          </Button>
          <Button variant="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PlayGameModal;
