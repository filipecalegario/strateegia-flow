import { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import * as api from "strateegia-api";

export default function DivPointList({ mapId, handleSelectChange }) {
  const [DivPointList, setDivPointList] = useState(null);

  useEffect(() => {
    async function fetchMapList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const map = await api.getMapById(accessToken, mapId);
        console.log("map: %o", map);
        // console.log('projectList: %o', projectList);

        setDivPointList(
          map.points.filter((point) => point.point_type === "DIVERGENCE")
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchMapList();
  }, [mapId]);

  return mapId ? (
    <Select
      placeholder="escolha o ponto de divergência"
      onChange={handleSelectChange}
    >
      {DivPointList
        ? DivPointList.map((divPoint) => {
            return (
              <option key={divPoint.id} value={divPoint.id}>
                {divPoint.title}
              </option>
            );
          })
        : null}
    </Select>
  ) : (
    ""
  );
}
