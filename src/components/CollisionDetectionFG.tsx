import { useRef, useState, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
//@ts-ignore
import { forceCollide } from "d3-force-3d";
import { useDisclosure } from "@chakra-ui/react";
import Modal from "@/components/GenericSidebar";
import { NodeType, Protocol } from "@/types";
import UniswapSidebar from "./UniswapSidebar";
import CowSwapSideBar from "./CowSwapSideBar";

interface Props {
  size: number;
  data: NodeType[];
  highlightColor: string;
}

const CollisionDetectionFG = ({ size, data, highlightColor }: Props) => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<NodeType | undefined>(
    undefined
  );
  const [originalColor, setOriginalColor] = useState("");

  const handleClick = (node) => {
    setOriginalColor(node.color);
    setSelectedNode(node);

    node.color = highlightColor;

    onOpen();

    fgRef.current.centerAt(
      node.x,
      node.y,
      500 // ms transition duration
    );
    fgRef.current.zoom(8, 500);
  };

  const handleClose = (node) => {
    onClose();

    node.color = originalColor;
    setSelectedNode({});
    fgRef.current.zoomToFit(1000, 300);
  };

  useEffect(() => {
    const fg = fgRef.current;

    if (fg) {
      // Deactivate existing forces
      fg.d3Force("center", null);
      fg.d3Force("charge", null);

      // Add collision and bounding box forces
      fg.d3Force(
        "collide",
        forceCollide((d) => d.val)
      );
      fg.d3Force("box", () => {
        const SQUARE_HALF_SIDE = size * 2;

        data.forEach((node) => {
          const x = node.x || 0,
            y = node.y || 0;

          // bounce on box walls
          if (Math.abs(x) > SQUARE_HALF_SIDE) {
            node.vx *= -1;
          }
          if (Math.abs(y) > SQUARE_HALF_SIDE) {
            node.vy *= -1;
          }
        });
      });
    }

    setGraphData({ nodes: data, links: [] });
  }, [data, size]);

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        cooldownTime={Infinity}
        d3AlphaDecay={0}
        d3VelocityDecay={0.035}
        onNodeClick={handleClick}
        nodeColor={(d) => d.color}
      />
      {selectedNode && (
        <>
          {selectedNode.protocol == Protocol.UNISWAP && (
            <UniswapSidebar
              isOpen={isOpen}
              onClose={() => handleClose(selectedNode)}
              node={selectedNode}
              inputToken={
                selectedNode.token0Address ==
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                  ? "NATIVE"
                  : selectedNode.token0Address
              }
              outputToken={
                selectedNode.token1Address ==
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                  ? "NATIVE"
                  : selectedNode.token1Address
              }
            />
          )}
          {selectedNode.protocol == Protocol.AAVE && (
            <Modal
              isOpen={isOpen}
              onClose={() => handleClose(selectedNode)}
              node={selectedNode}
              title='AAVE'
              color='#a462a0'
            />
          )}
          {selectedNode.protocol == Protocol.COWSWAP && (
            <CowSwapSideBar
              isOpen={isOpen}
              onClose={() => handleClose(selectedNode)}
              node={selectedNode}
            />
          )}
        </>
      )}
    </>
  );
};

export default CollisionDetectionFG;
