import React, { useState, useEffect } from "react";
import "../scss/components/_add.scss";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LiaHandMiddleFingerSolid } from "react-icons/lia";
import { FaTrashAlt } from "react-icons/fa";
import { db } from "../firebase/firebase";
import { getDocs, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Add from "../components/Add";
import BulletinEditor from "./BulletinEditor";
import { getAuth, getUserByEmail } from 'firebase/auth'

const Backend = () => {
  const [activeTab, setActiveTab] = useState("approvals"); // Default tab
  const [memberList, setMemberList] = useState([]);
  const auth = getAuth();

  const membersCollectionRef = collection(db, "members");

  useEffect(() => {
    const getMemberList = async () => {
      try {
        const data = await getDocs(membersCollectionRef);
        const members = data.docs.map((doc) => {
          const memberData = doc.data();
          return {
            ...memberData,
            id: doc.id,
            displayName: memberData.firstName || memberData.email.split('@')[0]  // Use firstName or email prefix
          };
        });
        console.log('Members:', members);
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

  const deleteMember = async (memberId) => {
    const memberDoc = doc(db, "members", memberId);
    await deleteDoc(memberDoc);

    // Update local state
    setMemberList((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
  };

  // Sort members: Approved members first, unapproved members last
  const sortedMemberList = [...memberList].sort((a, b) => a.isApproved === b.isApproved ? 0 : a.isApproved ? -1 : 1);

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
        <button
          className={activeTab === "bulletin" ? "active" : ""}
          onClick={() => setActiveTab("bulletin")}
        >
          BULLETIN EDITOR
        </button>
      </div>

      {activeTab === "approvals" && (
        <div className="tab-content">
          <h2>MEMBER APPROVALS</h2>
          {sortedMemberList.map((member) => (
            <div key={member.id} className={`member-item ${member.isApproved ? 'approved' : ''}`}>
              <div className="member-info">
                <div className="member-name">{member.displayName}</div>
                <div className="member-email">{member.email}</div>
              </div>
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
              <div
                className="delete-button"
                onClick={() => deleteMember(member.id)}
                style={{ cursor: "pointer" }}
              >
                <FaTrashAlt className="trash-icon" size={14} color="red" />
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

      {activeTab === "bulletin" && (
        <div className="tab-content">
          <h2>BULLETIN EDITOR</h2>
          <BulletinEditor />
        </div>
      )}
    </div>
  );
};

export default Backend;
