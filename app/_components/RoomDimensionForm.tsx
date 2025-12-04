import { useState, useEffect } from "react";

export default function RoomDimensionForm({ onSubmit }) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("feet");

  // Update parent component whenever dimensions change
  useEffect(() => {
    onSubmit({ length, width, height, unit });
  }, [length, width, height, unit, onSubmit]);

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2 text-gray-700">Room Dimensions</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <input
            type="number"
            value={length}
            onChange={e => setLength(e.target.value)}
            placeholder="Length"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(e.target.value)}
            placeholder="Width"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="Height (optional)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
          />
        </div>
        <div>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A790]"
          >
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
          </select>
        </div>
      </div>
    </div>
  );
} 