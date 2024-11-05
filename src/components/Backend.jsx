import React, { useState, useEffect } from 'react';
import "../scss/components/_backend.scss";
import initialMenuItems from '../utils/menuData';
import { db } from "../firebase/firebase";
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';


const Backend = () => {
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

   // Function to toggle approval status
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
   );
};


export default Backend;
