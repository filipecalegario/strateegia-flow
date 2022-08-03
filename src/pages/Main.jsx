import {
  Box,
  Heading,
  Select,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getFlowNotifications } from "../data/quickStrateegiaAPI";

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
        console.log("flow %o", flowData_);
        setFlowData(flowData_);
        const projects = flowData_.content.map((item) => {
          return {
            id: item.context.project.id,
            title: item.context.project.title,
          };
        });
        console.log("projects %o", projects);
        const distinctProjects = [
          ...new Set(projects.map((obj) => obj.id)),
        ].map((id) => {
          return projects.find((obj) => obj.id === id);
        });
        setProjectList(distinctProjects);
        console.log("distinct projects %o", distinctProjects);
        const idFromSelection = "601a83d4cf364315a4cb9814";
        const idFromSelection2 = "6115ca0b95aeec1babf1c589";
        const selectedContentByProject = flowData_.content.filter(
          (item) => item.context.project.id === idFromSelection
        );
        console.log("selected projects %o", selectedContentByProject);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    const accessToken_ = localStorage.getItem("accessToken");
    fetchFlow();
    setAccessToken(accessToken_);
  }, []);

  return (
    <Box padding={10}>
      <Box display="flex">
        {/* <ProjectList handleSelectChange={handleSelectChange} /> */}
        {/* <Link
          href={`https://app.strateegia.digital/journey/${selectedProject}/map/${firstMap}`}
          target="_blank"
          bg="#E9ECEF"
          borderRadius={" 0 6px 6px 0 "}
          fontSize={16}
          w={200}
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          link para a jornada
        </Link> */}
        <Select
          placeholder="escolha o projeto"
          onChange={handleSelectChange}
          borderRadius={"6px 0 0 6px"}
        >
          {projectList &&
            projectList.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              );
            })}
        </Select>
      </Box>
      <Loading active={isLoading} />
      <Box margin={10}>
        <UnorderedList margin={5}>
          {selectedFlow?.map((item) => (
            <ListItem key={item.id}>
              <strong>event type:</strong> {item.event_type}
              <br></br>
              <strong>author:</strong> {item.payload.author.name}
              <br></br>
              <strong>updated at:</strong> {item.payload.updated_at}
              <br></br>
              <strong>parent:</strong> {item.payload.parent?.text}
              <br></br>
              <strong>child:</strong> {item.payload.text}
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Box>
  );
}
