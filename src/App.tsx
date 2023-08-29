import "antd/dist/antd.css";

import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Row,
  Space,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

// import { text } from "./utils/parse";
const Index = () => {
  const [file, setFile] = useState();
  const [ignoreStrs, setIgnoreStrs] = useState<string[]>(["，", "。", "；"]);
  const [min, setMin] = useState(4);

  useEffect(() => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // 当读取完成时，内容只在`reader.result`中
      const text = reader.result as string;
      const indexArr: number[] = [0];
      for (let index = 0; index < text.length; index++) {
        const str = text[index];
        if (ignoreStrs.filter((i) => !!i).includes(str)) {
          indexArr.push(index);
        }
      }

      const strArr: string[] = [];

      for (let index = 0; index < indexArr.length; index++) {
        strArr.push(
          text.slice(
            indexArr[index] + 1,
            index === indexArr.length ? undefined : indexArr[index + 1]
          )
        );
      }

      const strSet = new Set<string>();

      for (let i = 0; i < strArr.length - 1; i++) {
        for (let j = i + 1; j < strArr.length; j++) {
          const pre = strArr[i];
          const aft = strArr[j];
          if (
            pre !== `”` &&
            aft !== `”` &&
            aft.length >= min &&
            pre.length >= min
          ) {
            if (pre === aft) {
              strSet.add(pre);
            }
            if (pre.includes(aft)) {
              strSet.add(aft);
            }
            if (aft.includes(pre)) {
              strSet.add(pre);
            }
          }
        }
      }
      let newT = text;
      strSet.forEach((s) => {
        newT = newT.replaceAll(s, `<span style="background:red">${s}</span>`);
      });
      document.getElementById("test-dom").innerHTML = newT;
    };
    reader.readAsText(file);
  }, [file, ignoreStrs, min]);

  return (
    <div style={{ width: "100%" }}>
      <Card title="去重检索">
        <Row>
          <Col span={6} style={{ textAlign: "right" }}>
            最短语句字数：
          </Col>
          <Col span={18}>
            <InputNumber
              value={min}
              onChange={(v) => {
                setMin(v as number);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={6} style={{ textAlign: "right" }}>
            语句分割符：
          </Col>
          <Col span={18}>
            <Space direction="vertical">
              {ignoreStrs.map((s, index) => {
                return (
                  <Space>
                    <Input
                      key={`s-${index}`}
                      value={s}
                      onChange={(v) => {
                        const newList = [...ignoreStrs];
                        newList.splice(index, 1, v.target.value);
                        setIgnoreStrs(newList);
                      }}
                    />
                    <MinusCircleOutlined
                      style={{ color: "red" }}
                      onClick={() => {
                        const newList = [...ignoreStrs];
                        newList.splice(index, 1);
                        setIgnoreStrs(newList);
                      }}
                    />
                  </Space>
                );
              })}
              <Button
                type="primary"
                onClick={() => {
                  setIgnoreStrs([...ignoreStrs, ""]);
                }}
              >
                添加语句分割符
                <PlusOutlined />
              </Button>
            </Space>
          </Col>
        </Row>

        <Upload.Dragger
          style={{ marginTop: 32 }}
          beforeUpload={(f) => {
            setFile(f);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件</p>
        </Upload.Dragger>

        <div id="test-dom"></div>
      </Card>
    </div>
  );
};

export default Index;
