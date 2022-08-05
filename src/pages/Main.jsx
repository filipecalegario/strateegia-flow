import {
  Box,
  ListItem,
  Select,
  UnorderedList,
  Text,
  Link,
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
import { getFlowNotifications } from "../data/quickStrateegiaAPI";
import SimpleSidebar from "./SimpleSidebar";

const diffDays = (date1, date2) =>
  parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [projectList, setProjectList] = useState(null);
  const [flowData, setFlowData] = useState(null);
  const [selectedFlow, setSelectedFlow] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleClick = (e) => {
    // console.log("click %o", e.target.id);
    setSelectedProject(e.target.id);
  };

  useEffect(() => {
    const selectedContentByProject = flowData?.content.filter(
      (item) => item.context.project.id === selectedProject
    );
    setSelectedFlow(selectedContentByProject);
  }, [selectedProject]);

  useEffect(() => {
    async function fetchFlow() {
      setIsLoading(true);
      try {
        const flowData_ = await getFlowNotifications(accessToken_);
        const projects = flowData_.content.map((item) => {
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
                          onClick={(e) =>
                            console.log("clicou curtir %o", e.target.id)
                          }
                        >
                          <Text id={item.payload.id} mr={2}>
                            curtir
                          </Text>
                        </Link>
                        <Text mr={2}>|</Text>
                        <Link
                          onClick={(e) =>
                            console.log("clicou comentar %o", e.target.id)
                          }
                        >
                          <Text
                            id={item.payload.id}
                          >
                            comentar
                          </Text>
                        </Link>
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
