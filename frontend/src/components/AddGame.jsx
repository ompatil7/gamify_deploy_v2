import React, { useState, useRef } from "react";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  Image,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import usePreviewImg from "../hooks/usePreviewImg";

const AddGame = ({ onGameAdded }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gameName, setGameName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [gifs, setGifs] = useState([]);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const gifRefs = useRef([]);
  const showToast = useShowToast();

  const handleAddGame = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", gameName);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags));
      if (imageRef.current.files[0]) {
        formData.append("image", imageRef.current.files[0]);
      }
      if (logo) {
        formData.append("logo", logo);
      }
      gifs.forEach((gif, index) => {
        formData.append(`gifs`, gif);
      });

      const res = await fetch("/api/games/add", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Game added successfully", "success");

      // Clear the form
      setGameName("");
      setDescription("");
      setImgUrl("");
      setLogo(null);
      setTags([]);
      setGifs([]);
      onClose();
      onGameAdded(); // Notify parent component about the new game
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleGifChange = (e) => {
    const files = Array.from(e.target.files);
    setGifs([...gifs, ...files]);
  };

  const handleRemoveGif = (index) => {
    const newGifs = gifs.filter((_, i) => i !== index);
    setGifs(newGifs);
  };

  return (
    <>
      <Button
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={"lg"}
        fontSize={"xl"}
        mt={4}
        p={4}
        color={useColorModeValue("gray.dark", "#3FC1C9")}
      >
        Add Game +
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Game Name</FormLabel>
              <Input
                placeholder="Game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={20}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}

            <FormControl mt={4}>
              <FormLabel>Logo</FormLabel>
              <Input
                type="file"
                hidden
                ref={logoRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogo(file);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={20}
                onClick={() => logoRef.current.click()}
              />
            </FormControl>

            {logo && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={URL.createObjectURL(logo)} alt="Selected logo" />
                <CloseButton
                  onClick={() => {
                    setLogo(null);
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}

            <FormControl mt={4}>
              <FormLabel>GIFs</FormLabel>
              <Input
                type="file"
                hidden
                multiple
                // accept="image/gif"
                ref={gifRefs}
                onChange={handleGifChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={20}
                onClick={() => gifRefs.current.click()}
              />
            </FormControl>

            {gifs.length > 0 && (
              <Flex mt={5} w={"full"} flexWrap={"wrap"}>
                {gifs.map((gif, index) => (
                  <Flex key={index} position={"relative"} m={2}>
                    <Image
                      src={URL.createObjectURL(gif)}
                      alt={`Selected gif ${index}`}
                      boxSize={"100px"}
                      objectFit={"cover"}
                    />
                    <CloseButton
                      onClick={() => handleRemoveGif(index)}
                      bg={"gray.800"}
                      position={"absolute"}
                      top={2}
                      right={2}
                    />
                  </Flex>
                ))}
              </Flex>
            )}

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Flex>
                <Input
                  placeholder="Enter tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button onClick={handleAddTag} ml={2}>
                  Add Tag
                </Button>
              </Flex>
              <Flex mt={2} flexWrap={"wrap"}>
                {tags.map((tag, index) => (
                  <Tag key={index} size={"md"} m={1} borderRadius={"full"}>
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={loading}
              onClick={handleAddGame}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddGame;
