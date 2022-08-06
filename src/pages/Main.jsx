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

  const handleClick = (e) => {
    // console.log("click %o", e.target.id);
    setSelectedProject(e.target.id);
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

  return (
    <SimpleSidebar sideBarItems={sideBarProjects} handleClick={handleClick}>
      <Box padding={10}>
        <Text fontSize="lg">{projectTitle}</Text>
        <Loading active={isLoading} />
        <Box margin={10}>
          <UnorderedList margin={5}>
            {selectedFlow?.map(
              (item, index) =>
                index < 25 && (
                  <>
                    <Link
                      key={index}
                      href={`https://app.strateegia.digital/journey/${item.context.project?.id}/map/${item.context.map?.id}/point/${item.context.point?.id}`}
                      isExternal
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem key={item.id} mb={1}>
                        <strong>event type:</strong> {item.event_type}
                        <br></br>
                        <strong>author:</strong> {item.payload.author?.name}
                        <br></br>
                        <strong>updated at: </strong>
                        {new Date(
                          new Date(item.payload.updated_at) -
                            new Date().getTimezoneOffset() * 60 * 1000
                        ).toLocaleDateString("pt-br")}{" "}
                        {new Date(
                          new Date(item.payload.updated_at) -
                            new Date().getTimezoneOffset() * 60 * 1000
                        ).toLocaleTimeString("pt-BR", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                        {" ("}
                        {diffDays(
                          new Date(item.payload.updated_at),
                          new Date()
                        )}
                        {" dias atrás)"}
                        <br></br>
                        <strong>parent:</strong> {item.payload.parent?.text}
                        <br></br>
                        <strong>child:</strong> {item.payload.text}
                      </ListItem>
                    </Link>
                    {item.event_type === "QuestionCommentCreatedEvent" ? (
                      <Box display="flex" border="2x solid blue" mb={3}>
                        <Link
                          onClick={(e) => {
                            handleClickAgreement(e);
                          }}
                        >
                          {!agreementList.includes(item.payload.id) ? (
                            <Text id={item.payload.id} mr={2}>
                              curtir
                            </Text>
                          ) : (
                            <Text id={item.payload.id} mr={2} color="grey">
                              remover curtida
                            </Text>
                          )}
                        </Link>
                        <Text mr={2}>|</Text>

                        {!showCommentBoxList.includes(item.payload.id) ? (
                          <Link
                            onClick={(e) => {
                              handleShowCommentClick(e);
                            }}
                          >
                            <Text id={item.payload.id}>comentar</Text>
                          </Link>
                        ) : (
                          <>
                            <Link
                              onClick={(e) => {
                                handleShowCommentClick(e);
                              }}
                            >
                              <Text id={item.payload.id}>fechar</Text>
                            </Link>
                            <Textarea
                              id={item.payload.id}
                              placeholder="Here is a sample placeholder"
                              size="xs"
                              onChange={(e) =>
                                handleCommentChange(e, item.payload.parent)
                              }
                            ></Textarea>
                            <Button
                              onClick={(e) =>
                                handleCommentSendClick(e, item.payload.parent)
                              }
                              id={item.payload.id}
                            >
                              enviar
                            </Button>
                          </>
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
  );
}
