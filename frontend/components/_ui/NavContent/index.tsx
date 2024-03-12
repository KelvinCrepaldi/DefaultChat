
type NavContentProps = {
  firstContent?: React.ReactNode, 
  secondContent?: React.ReactNode
  hidden: boolean
}

const NavContent = ({firstContent, secondContent, hidden=false}: NavContentProps) =>{
  return (
  <div className="flex m-2 gap-3">
    {firstContent}
    {!hidden && secondContent}
  </div>
  )
}
export default NavContent;