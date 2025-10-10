import { Badge } from "./ui/badge"

export const BadgePrimaryOutline = ({ children, ...other }) => {
  return (
    <div
      className="bg-linear-to-r
            from-[#E2574C]
            via-[#C36648]
            to-[#2EAD33]
              p-1
              flex items-center justify-center"
    >
      <Badge className="badge text-capitalize bg-color gap-1 items-center" {...other}
        style={{
          color: 'white',
        }}
      >
        {children}
      </Badge>
    </div>
  )
}

export const BadgePrimary = ({ children, ...other }) => {
  return (
    <Badge className='text-capitalize badge-primary gap-1 items-center' {...other}>
      {children}
    </Badge>
  )
}

export const BadgeWhite = ({ children, ...other }) => {
  return (
    <Badge className='text-capitalize badge gap-1 items-center' style={{ backgroundColor: 'white' }} {...other}>
      {children}
    </Badge>
  )
}

