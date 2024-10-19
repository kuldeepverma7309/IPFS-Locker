import { useState } from "react";
import { pinata } from "../utils/pinataSetup";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [Otheraddress, setOtherAddress] = useState("");

  const getdata = async () => {
    let dataArray;
    try {
      if (Otheraddress.trim().length > 0) {
        dataArray = await contract.display(Otheraddress);

      } else {
        dataArray = await contract.display(account);

      }
    } catch (e) {
      alert("You don't have access");
      return;
    }
    console.log("dataArray", dataArray);

    const isEmpty = Object.keys(dataArray).length === 0;
    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      const pinataUrlPromise = str_array.map(async (item, i) => {
        return pinata.gateways.createSignedURL({
          cid: item.toString(),
          expires: 315360000 // 10 years
        })
      });
      const pinataUrls = await Promise.all(pinataUrlPromise);
      console.log(`pinataUrls`, pinataUrls);
      const images = pinataUrls.map((item, i) => (
        <a href={item} key={i} target="_blank">
          <img
            key={i}
            src={item}
            alt="new"
            className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          />
        </a>
      ));
      setData(images);

    } else {
      alert("No image to display");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-6 mb-6">
        {data.length ? (
          <div className="grid grid-cols-2 gap-4">
            {data}
          </div>
        ) : (
          <p className="text-gray-300 text-center">No images to display</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Address"
          className="w-full sm:w-2/3 bg-gray-700 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          onChange={(e) => setOtherAddress(e.target.value)}
        />
        <button
          className="w-full sm:w-1/3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
          onClick={getdata}
        >
          Get Data
        </button>
      </div>
    </div>
  );
};

export default Display;
