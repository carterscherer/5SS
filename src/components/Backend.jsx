import React, { useState, useEffect } from "react";
import "../scss/components/_backend.scss";

import { IoImageSharp } from "react-icons/io5"; 
import { db, storage } from "../firebase/firebase"; 
import { getDocs, collection, updateDoc, doc, addDoc } from "firebase/firestore";
//import { ref, getStorage } from "firebase/firestore";

import NewAdd from "../components/NewAdd"


const Backend = () => {

  const [activeTab, setActiveTab] = useState("approvals"); // Default tab
  const [memberList, setMemberList] = useState([]);

  //const menuImageRef = ref(storage, 'mountains.jpg');
  const membersCollectionRef = collection(db, "members");


  useEffect(() => {

    const getMemberList = async () => {
      try {
        const data = await getDocs(membersCollectionRef);
        const members = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setMemberList(members);
      } catch (err) {
        console.error(err);
      }
    };
    getMemberList();
  }, []);

  const toggleApproval = async (memberId, currentStatus) => {
    const memberDoc = doc(db, "members", memberId);
    await updateDoc(memberDoc, { isApproved: !currentStatus });

    // Update local state
    setMemberList((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, isApproved: !currentStatus } : member
      )
    );
  };





  return (

    <div className="backend">
      <div className="tabs">
        <button
          className={activeTab === "approvals" ? "active" : ""}
          onClick={() => setActiveTab("approvals")}
        >
          Approvals
        </button>
        <button
          className={activeTab === "menu" ? "active" : ""}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>
      </div>

      {activeTab === "approvals" && (
        <div className="tab-content">
          <h2>Member Approvals</h2>
          {memberList.map((member) => (
            <div key={member.id} className="member-item">
              <h3 style={{ color: member.isApproved ? "green" : "red" }}>
                {member.firstName || "Unnamed"} - {member.email}
              </h3>
              <input
                type="checkbox"
                checked={member.isApproved}
                onChange={() => toggleApproval(member.id, member.isApproved)}
              />
              <label>Approve</label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "menu" && (
        <div className="tab-content">
          <h2>Menu Items</h2>

            <NewAdd />

        </div>
      )}
    </div>
  );
};

export default Backend;
