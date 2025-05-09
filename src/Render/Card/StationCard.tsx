import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import "./StationCard.scss";
import classNames from "classnames";
import { Point } from "../../DataStructure/Point";
import {
  CardShowing,
  InsertInfo,
  StationProps,
  UserDataType,
  dataProcessor,
} from "../../Data/UserData";
import shapes from "../../Resource/Shape/shape";
import { Shape } from "../../Data/Shape";
import { AutoGrowthInput } from "../../Common/AutoGrowthInput";
import {
  browserInfo,
  onWheelX,
  onWheelY,
  scrollOptimize,
} from "../../Common/util";
import { showConfirmationInterface } from "../Delete/DeleteConfirmation";
import { FunctionMode } from "../../DataStructure/Mode";
import { useTranslation } from "react-i18next";
export function StationCard({
  station,
  setData,
  data,
  showConfirmation,
  menuRef,
  functionMode,
  setFunctionMode,
  insertInfo,
  setInsertInfo,
  cardShowing,
  setCardShowing,
}: {
  station: StationProps;
  setData: Dispatch<SetStateAction<UserDataType>>;
  data: UserDataType;
  showConfirmation?: showConfirmationInterface;
  menuRef: RefObject<any>;
  functionMode: FunctionMode;
  setFunctionMode: React.Dispatch<React.SetStateAction<FunctionMode>>;
  insertInfo?: InsertInfo;
  setInsertInfo: React.Dispatch<React.SetStateAction<InsertInfo | undefined>>;
  cardShowing: CardShowing;
  setCardShowing: Dispatch<SetStateAction<CardShowing>>;
}) {
  const {
    stationName,
    lineIds,
    position,
    shape: shapeSelected,
    stationId,
    tagDirection=8,
  } = station;
  const {
    setStationName,
    setStationPosition,
    setStationShape,
    getLineById,
    deleteStation,
    removeStationFromLine,
    addNewLine,
    setStationTagDirection,
  } = dataProcessor(stationId, setData, data);
  const [x, y] = position;
  const setX = (x: number) => setStationPosition(x, y);
  const setY = (y: number) => setStationPosition(x, y);
  const lineCount = lineIds.length;
  const [tab, setTab] = useState("name");
  const { engine } = browserInfo;
  const { t } = useTranslation();
  const tags = [
    t('station.up'),
    t('station.upRight'),
    t('station.right'),
    t('station.rightDown'),
    t('station.down'),
    t('station.downLeft'),
    t('station.left'),
    t('station.leftUp'),
    t('station.auto')
  ];
  const editTools = (tab: string) => {
    switch (tab) {
      case "name": {
        return (
          <div className="name-detail">
            <div className="name-item sign">
              <div className="title">{t('station.x')}</div>
              <AutoGrowthInput
                value={x}
                onInput={(x) => setX(Number(x.currentTarget.value))}
                type="number"
              />
            </div>
            <div className="name-item order">
              <div className="title">{t('station.y')}</div>
              <AutoGrowthInput
                value={y}
                onInput={(y) => setY(Number(y.currentTarget.value))}
                type="number"
              />
            </div>
          </div>
        );
      }
      case "color": {
        const column = 4;
        const row = 3;
        const grid = new Array(column * row).fill(0);
        Object.keys(shapes).forEach((shape, index) => (grid[index] = shape));
        return (
          <div className="color-detail">
            <div className="color-detail-choosing">
              {grid.map((shape, index) => {
                const left = index % column === 0;
                const bottom = Math.floor(index / column) === row - 1;
                // console.log({ shape });
                return (
                  <div
                    className={classNames({
                      "shape-container": 1,
                      left,
                      bottom,
                    })}
                    onClick={() => {
                      if (shape) setStationShape(shape);
                    }}
                  >
                    <div
                      className={classNames({
                        "shape-preview": 1,
                        "shape-selected": shape === shapeSelected,
                        [shape]: 1,
                      })}
                    >
                      {
                        //@ts-ignore
                        shapes[shape]
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case "operation": {
        return (
          <div className="operation-detail">
            <div
              className="operation-item add-new-line-btn"
              onClick={(e) => {
                const newLine = addNewLine();
                setInsertInfo({ insertIndex: 1, line: newLine! });
                // setFunctionMode(FunctionMode.selectingStation);
                if (menuRef?.current?.showTools) {
                  menuRef.current.showTools(e, FunctionMode.selectingStation);
                }
              }}
            >
              {t('station.startHere')}
            </div>
            {lineIds.map((lineId) => {
              const line = getLineById(lineId);
              const stationIndexes: number[] = [];
              line?.stationIds.forEach((x, index) => {
                if (x === stationId) stationIndexes.push(index);
              });
              const { lineName } = line!;
              const removeStations = stationIndexes.map((stationIndex) => (
                <div
                  className="operation-item delete"
                  onClick={() => {
                    showConfirmation!({ line, station, stationIndex }, () => {
                      removeStationFromLine(lineId, stationIndex);
                    });
                  }}
                >
                  {t('station.remove',{lineName,stationIndex: stationIndex! + 1})}...
                </div>
              ));
              return removeStations;
            })}
            <div
              className="operation-item delete"
              onClick={() => {
                showConfirmation!({ station }, () => {
                  deleteStation();
                  if (menuRef?.current?.backToTitle) {
                    menuRef.current.backToTitle();
                  }
                });
              }}
            >
              {t('station.delete')}
            </div>
          </div>
        );
      }
      case "tag": {
        const directMapIndex = [7, 0, 1, 6, 8, 2, 5, 4, 3];
        return (
          <div className="tag-detail">
            {directMapIndex.map((direct, index) => {
              if (index === 4)
                return (
                  <div
                    onClick={() => {
                      setStationTagDirection(8);
                    }}
                    className="tag-item center"
                  >
                    {tags[tagDirection]}
                  </div>
                );
              else
                return (
                  <div
                    onClick={() => {
                      setStationTagDirection(direct);
                    }}
                    className={classNames({
                      "tag-item": 1,
                      selected: tagDirection === direct,
                    })}
                  ></div>
                );
            })}
          </div>
        );
      }
    }
  };
  return (
    <div
      className={classNames({ "station-card": 1 })}
      style={
        engine.name === "WebKit"
          ? { boxShadow: "0 4px 59px 7px rgba(0, 0, 0, 0.25)" }
          : {}
      }
    >
      <div
        className="line-count"
        onClick={() => {
          setCardShowing({
            stationIds: [stationId],
            lineIds,
            stationFirst: true,
          });
        }}
      >
        {lineCount}{t('station.lines')}
      </div>
      <AutoGrowthInput
        onInput={(e) => setStationName(e.currentTarget.value)}
        className="station-name"
        value={stationName}
      />
      <div className="edit-detail" onWheel={onWheelY}>
        {editTools(tab)}
      </div>

      {
        <div className={classNames({ "edit-panel": 1, edit: 1 })}>
          <div
            className={classNames({
              "edit-tools": 1,
            })}
            onWheel={onWheelY}
          >
            <div
              className={classNames({
                "edit-tool name": 1,
                selected: tab === "name",
              })}
              onClick={(e) => {
                scrollOptimize(e);
                setTab("name");
              }}
            >
              <div className="title">{t('station.poisition')}</div>
              <div className="value">
                X<span className="position">{x}</span>Y
                <span className="position">{y}</span>
              </div>
            </div>
            <div
              className={classNames({
                "edit-tool color": 1,
                selected: tab === "color",
              })}
              onClick={(e) => {
                scrollOptimize(e);
                setTab("color");
              }}
            >
              <div className="title">{t('station.shape')}</div>
              <div className="value">
                {
                  t(`shape.${shapeSelected}`)
                }
              </div>
            </div>
            <div
              className={classNames({
                "edit-tool operation station-card-operation": 1,
                selected: tab === "operation",
              })}
              onClick={(e) => {
                scrollOptimize(e);
                setTab("operation");
              }}
            >
              <div className="title">{t('station.operation')}</div>
              <div className="value">{t('station.operateDes')}</div>
            </div>
            <div
              className={classNames({
                "edit-tool operation tag": 1,
                selected: tab === "tag",
              })}
              onClick={(e) => {
                scrollOptimize(e);
                setTab("tag");
              }}
            >
              <div className="title">{t('station.stationName')}</div>
              <div className="value">{tags[tagDirection]}</div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
