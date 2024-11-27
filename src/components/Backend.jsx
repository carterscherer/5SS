import React, { useState, useEffect } from "react";
import "../scss/components/_add.scss";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LiaHandMiddleFingerSolid } from "react-icons/lia";
import { db } from "../firebase/firebase";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import Add from "../components/Add";

const Backend = () => {
  const [activeTab, setActiveTab] = useState("approvals"); // Default tab
  const [memberList, setMemberList] = useState([]);

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
          MEMBER APPROVALS
        </button>
        <button
          className={activeTab === "menu" ? "active" : ""}
          onClick={() => setActiveTab("menu")}
        >
          MENU EDITOR
        </button>
      </div>

      {activeTab === "approvals" && (
        <div className="tab-content">
          <h2>MEMBER APPROVALS</h2>
          {memberList.map((member) => (
            <div key={member.id} className="member-item">
              <h3 style={{ color: member.isApproved ? "green" : "red" }}>
                {member.firstName || "Unnamed"} - {member.email}
              </h3>
              <div
                className="approval-checkbox"
                onClick={() => toggleApproval(member.id, member.isApproved)}
                style={{ cursor: "pointer" }}
              >
                {member.isApproved ? (
                  <IoMdCheckmarkCircle size={24} color="green" />
                ) : (
                  <LiaHandMiddleFingerSolid size={24} color="gray" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "menu" && (
        <div className="tab-content">
          <h2>MENU EDITOR</h2>
          <Add />
        </div>
      )}
    </div>
  );
};

export default Backend;
