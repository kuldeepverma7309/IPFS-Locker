import { useState, useEffect } from "react";

const Modal = ({ setModalOpen, contract }) => {
  const [address, setAddress] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [disAllowAddress, setDisAllowAddress] = useState("");

  const sharing = async () => {
    if (address) {
      try {
        const tx = await contract.allow(address);
        await tx.wait();
        setModalOpen(false);
        alert("Successfully shared access");
      } catch (error) {
        console.error("Error sharing access:", error);
      }
    } else {
      alert("Please enter an address");
    }
  };

  const handleDisAllow = async (e) => {
    e.preventDefault();
    if (disAllowAddress.trim().length > 0) {
      try {
        const tx = await contract.disallow(disAllowAddress);
        await tx.wait();
        alert("Successfully disallowed access");
        window.location.reload();
      } catch (error) {
        console.error("Error disallowing access:", error);
      }
    } else {
      alert("Please select an address");
    }
  };
  console.log("disAllowAddress", disAllowAddress);

  useEffect(() => {
    const fetchAccessList = async () => {
      try {
        const addressList = await contract.shareAccess();
        const addresses = addressList.map((access) => {
          if(access.access){
            return access.user
          }
        });
        setAccessList(addresses);
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };

    if (contract) fetchAccessList();
  }, [contract]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Share Access</h2>
        </div>

        {/* Input for sharing access */}
        <div className="mb-6">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Address"
          />
        </div>

        {/* Button controls */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setModalOpen(false)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={sharing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            Share
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        {/* Form for disallowing access */}
        <form onSubmit={handleDisAllow}>
          <div className="mb-4">
            <select
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setDisAllowAddress(e.target.value)}
              value={disAllowAddress}
            >
              <option value="" className="text-gray-500" disabled>Select Address</option>
              {accessList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 font-semibold"
            type="submit"
          >
            Disallow
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
