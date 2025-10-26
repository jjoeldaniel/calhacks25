import React from 'react'
import { useUI } from '../../Contexts/UIContext';
import type {UserData,MeetingRoomData} from '../../Pages/MeetingLayout';

interface Separator {
  roleName : string;
  roleMemberAmount : number,
  index : number
}

interface UserDataContainer {
  userData : UserData
}



const RoleSeparator : React.FC<Separator> = ({roleName,roleMemberAmount,index}) => {
  return (
    <div style={{
      marginTop : index !== 0 ? "10px" : "0px"
    }} className='w-full font-[inter] text-[14px] text-accent-text'>
      <span>{roleName} — {roleMemberAmount}</span>
    </div>
  )
}

const MemberContainer : React.FC<UserDataContainer> = ({userData}) => {
  return (
    <div className='w-full flex gap-3 mt-[5px] items-center'>
        <div className='relative w-8 h-8 shrink-0 grow-0'>
          <img src={userData.headshot} alt="" className='h-full rounded-full'/>
          <div className='absolute bg-[#00C950] rounded-full h-3 aspect-square -bottom-0.5 right-[-5px] border-2 border-secondary-bg '/>
        </div>
        <div className='flex flex-col w-full font-[inter]'>
          <span className='text-main-text text-[14px]'>{userData.userName}</span>
          <span className='text-accent-text text-[12px]'>{userData.pronouns}</span>

        </div>
    </div>
  )
}

const Sidebar : React.FC = () => {
  const [MeetingInfo] = useUI("MeetingRoomData")
  

  return (
    <div className='h-full w-60 bg-secondary-bg shrink-0 flex flex-col border-l border-main-border'>
      {/* Top Bar */}
      <div className='flex items-center justify-between w-full h-[77px] shrink-0 font-[inter] text-[16px] text-accent-text border-b border-main-border px-4'>
        <span>Active Members</span>
      </div>
      {/* Top Bar */}

      <div className='w-full h-full overflow-y-scroll p-3 flex flex-col'>
        <RoleSeparator roleName='AI' roleMemberAmount={1} index={0}/>
        <MemberContainer userData={{
          userName:MeetingInfo?.roomName,
          headshot:MeetingInfo?.headshot,
          role: "AI",
          bio:"",
          pronouns: "idk/idkt"
        }}/>

        <RoleSeparator roleName='user' roleMemberAmount={MeetingInfo?.members?.length} index={0}/>
        {MeetingInfo?.members && MeetingInfo?.members?.map((user) => {
          console.log(user)
          return <>
          
          <MemberContainer userData={user}/>
          </>
        })}
      </div>
    </div>
  )
}

export default Sidebar