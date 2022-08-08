import {
  Box,
  ListItem,
  Select,
  UnorderedList,
  Text,
  Link,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiCompass,
  FiHome,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import Loading from "../components/Loading";
import {
  getFlowNotifications,
  addCommentAgreement,
  deleteCommentAgreement,
} from "../data/quickStrateegiaAPI";
import SimpleSidebar from "./SimpleSidebar";
import { createReplyComment } from "strateegia-api";

const diffDays = (date1, date2) =>
  parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [projectList, setProjectList] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [agreementList, setAgreementList] = useState([]);
  const [showCommentBoxList, setShowCommentBoxList] = useState([]);
  const [commentValueList, setCommentValueList] = useState([]);
  const [itemMarkedAsReadList, setItemMarkedAsReadList] = useState([]);

  const handleClick = (e) => {
    // console.log("click %o", e.target.id);
    setSelectedProject(e.target.id);
  };

  const handleMarkAsRead = (e) => {
    const id = e.target.id;
    if (!itemMarkedAsReadList.includes(id)) {
      setItemMarkedAsReadList([...itemMarkedAsReadList, id]);
    } else {
      setItemMarkedAsReadList([
        ...itemMarkedAsReadList.filter((item) => item !== id),
      ]);
    }
  };

  const handleClickAgreement = (e) => {
    const id = e.target.id;
    console.log("clicou curtir %o", id);
    if (!agreementList.includes(id)) {
      setAgreementList([...agreementList, id]);
      try {
        addCommentAgreement(accessToken, e.target.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      setAgreementList([...agreementList.filter((item) => item !== id)]);
      try {
        deleteCommentAgreement(accessToken, e.target.id);
        console.log("agreement deleted");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleShowCommentClick = (e) => {
    const id = e.target.id;
    console.log("clicou comentar %o", id);
    if (!showCommentBoxList.includes(id)) {
      setShowCommentBoxList([...showCommentBoxList, id]);
    } else {
      setShowCommentBoxList([
        ...showCommentBoxList.filter((item) => item !== id),
      ]);
    }
  };

  const handleCommentChange = (e) => {
    const id = e.target.id;
    const inputValue = e.target.value;
    setCommentValueList([
      ...commentValueList.filter((item) => item.id !== id),
      { id: id, value: inputValue },
    ]);
  };

  const handleCommentSendClick = (e, parent) => {
    console.log("parentId %o", parent);
    async function addComment(comment) {
      if (parent) {
        await createReplyComment(accessToken, parent.id, comment.value);
      } else {
        await createReplyComment(accessToken, comment.id, comment.value);
      }
    }

    const id = e.target.id;
    const comment = commentValueList.find((item) => item.id === id);
    if (comment) {
      console.log("comment id: %o | value: %o", comment.id, comment.value);
      addComment(comment);
    }
    setShowCommentBoxList([
      ...showCommentBoxList.filter((item) => item !== id),
    ]);
    setCommentValueList([...commentValueList.filter((item) => item.id !== id)]);
  };

  useEffect(
    () => console.log("showComments %o", showCommentBoxList),
    [showCommentBoxList]
  );

  useEffect(
    () => console.log("agreementList %o", agreementList),
    [agreementList]
  );

  useEffect(
    () => console.log("itemMarkedAsReadList %o", itemMarkedAsReadList),
    [itemMarkedAsReadList]
  );

  // useEffect(
  //   () => console.log("commentValueList %o", commentValueList),
  //   [commentValueList]
  // );

  useEffect(() => {
    const selectedContentByProject = flowData?.content.filter(
      (item) => item.context.project.id === selectedProject
    );
    setSelectedFlow(selectedContentByProject);
  }, [flowData?.content, selectedProject]);

  useEffect(() => {
    async function fetchFlow() {
      setIsLoading(true);
      try {
        const flowData_ = await getFlowNotifications(accessToken_);
        const projects = flowData_.content.map((item) => {
          // console.log(item.event_type);
          return {
            id: item.context.project.id,
            title: item.context.project.title,
          };
        });
        const distinctProjects = [
          ...new Set(projects.map((obj) => obj.id)),
        ].map((id) => {
          return projects.find((obj) => obj.id === id);
        });
        setFlowData(flowData_);
        // console.log("flowData_ inverted order %o", flowData_.content.sort((a,b) => new Date(a.updated_at) - new Date(b.updated_at)))
        setProjectList(distinctProjects);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    const accessToken_ = localStorage.getItem("accessToken");
    fetchFlow();
    setAccessToken(accessToken_);
  }, []);

  const sideBarProjects = projectList?.map((project) => {
    return { name: project.title, id: project.id, icon: FiCompass };
  });

  const projectTitle = projectList?.find(
    (e) => e.id === selectedProject
  )?.title;

  const formatDateToShow = (dateAsString) => {
    const dateInCurrentTimezone = new Date(
      new Date(dateAsString) - new Date().getTimezoneOffset() * 60 * 1000
    );
    const dateToLocale = dateInCurrentTimezone.toLocaleDateString("pt-br");
    const timeToLocale = dateInCurrentTimezone.toLocaleTimeString("pt-BR", {
      hour: "numeric",
      minute: "numeric",
    });
    const daysBetween = diffDays(new Date(dateAsString), new Date());
    return `${dateToLocale} ${timeToLocale} (${daysBetween} dias atrás)`;
  };

  return (
    <>
      {!isLoading ? (
        <SimpleSidebar sideBarItems={sideBarProjects} handleClick={handleClick}>
          <Text
            textAlign={{ base: "center", md: "left" }}
            h={{ base: "100%", md: "80px" }}
            py={{ base: "10px", md: "20px" }}
            mx={{ base: "auto", md: "90px" }}
            fontWeight="bold"
            fontSize={{ base: "lg", md: "2xl" }}
          >
            {projectTitle}
          </Text>
          <Box
            padding="none"
            m="none"
            as="hr"
            borderBottom="sm"
            borderColor="#25C6A8"
          />
          <Box px={6}>
            <Loading active={isLoading} />
            <Box margin={10}>
              <UnorderedList margin={5}>
                {selectedFlow?.map(
                  (item, index) =>
                    index < 25 &&
                    item.event_type === "QuestionCommentCreatedEvent" && (
                      <>
                        <Link
                          key={index}
                          href={`https://app.strateegia.digital/journey/${item.context.project?.id}/map/${item.context.map?.id}/point/${item.context.point?.id}`}
                          isExternal
                          style={{ textDecoration: "none" }}
                        >
                          {item.payload.parent ? (
                            <ListItem key={item.id} mb={1}>
                              <strong>{item.payload.author?.name}</strong>{" "}
                              comentou a resposta de{" "}
                              <strong>
                                {item.payload.parent.author?.name}
                              </strong>{" "}
                              no ponto de divergência{" "}
                              <strong>{item.context.point.title}</strong> no
                              mapa <strong>{item.context.map.title}</strong> em{" "}
                              {formatDateToShow(item.payload.updated_at)}:{" "}
                              {item.payload.text}
                            </ListItem>
                          ) : (
                            <ListItem key={item.id} mb={1}>
                              <strong>{item.payload.author?.name}</strong>{" "}
                              respondeu uma questão no ponto de divergência{" "}
                              <strong>{item.context.point.title}</strong> no
                              mapa <strong>{item.context.map.title}</strong> em{" "}
                              {formatDateToShow(item.payload.updated_at)}:{" "}
                              {item.payload.text}
                            </ListItem>
                          )}
                        </Link>
                        {item.event_type === "QuestionCommentCreatedEvent" ? (
                          <Box display="flex" border="2x solid blue" mb={3}>
                            {/* {!itemMarkedAsReadList.includes(
                          item.notification_id
                        ) ? (
                          <Link style={{ textDecoration: "none" }} onClick={(e) => handleMarkAsRead(e)}>
                            <Text fontSize={{base: 'xs', md: 'lg'}} color='#25C6A8' id={item.notification_id} mr={2}>
                              marcar como lida
                            </Text>
                          </Link>
                        ) : (
                          <Text id={item.notification_id} mr={2} color="grey">
                            ✔︎ lida
                          </Text>
                        )}

                        <Text mr={2} color='#25C6A8'>|</Text> */}
                            <Link
                              style={{ textDecoration: "none" }}
                              onClick={(e) => {
                                handleClickAgreement(e);
                              }}
                            >
                              {!agreementList.includes(item.payload.id) ? (
                                <Text
                                  fontSize={{ base: "xs", md: "lg" }}
                                  color="#25C6A8"
                                  id={item.payload.id}
                                  mr={2}
                                >
                                  curtir
                                </Text>
                              ) : (
                                <Text color="grey" id={item.payload.id} mr={2}>
                                  remover curtida
                                </Text>
                              )}
                            </Link>
                            <Text color="#25C6A8" mr={2}>
                              |
                            </Text>
                            {!showCommentBoxList.includes(item.payload.id) ? (
                              <Link
                                style={{ textDecoration: "none" }}
                                onClick={(e) => {
                                  handleShowCommentClick(e);
                                }}
                              >
                                <Text
                                  fontSize={{ base: "xs", md: "lg" }}
                                  color="#25C6A8"
                                  id={item.payload.id}
                                >
                                  comentar
                                </Text>
                              </Link>
                            ) : (
                              <Box mr={2}>
                                <Link
                                  onClick={(e) => {
                                    handleShowCommentClick(e);
                                  }}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Text id={item.payload.id}>fechar</Text>
                                </Link>
                                <Textarea
                                  id={item.payload.id}
                                  placeholder="adicione aqui seu comentário"
                                  size="xs"
                                  onChange={(e) =>
                                    handleCommentChange(e, item.payload.parent)
                                  }
                                  resize="none"
                                ></Textarea>
                                <Button
                                  onClick={(e) =>
                                    handleCommentSendClick(
                                      e,
                                      item.payload.parent
                                    )
                                  }
                                  id={item.payload.id}
                                >
                                  enviar
                                </Button>
                              </Box>
                            )}
                          </Box>
                        ) : null}
                      </>
                    )
                )}
              </UnorderedList>
            </Box>
          </Box>
        </SimpleSidebar>
      ) : (
        <>
          <Loading active={isLoading} />
        </>
      )}
    </>
  );
}
