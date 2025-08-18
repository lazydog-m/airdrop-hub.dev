import PropTypes from 'prop-types';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';
import { ButtonOutline } from './Button';
import { ChevronLeft } from 'lucide-react';

export const HeaderAction = ({ heading, action, ...other }) => {

  return (
    <div className='d-flex justify-content-between align-items-center' {...other}>
      <span className='fw-700 font-inter fs-23 color-white'>{heading}</span>
      {action}
    </div>
  )

}

export const HeaderBack = ({ heading, url, ...other }) => {

  return (
    <div className='d-flex align-items-center' {...other}>
      <Link to={url}>
        <ButtonOutline
          icon={<ChevronLeft />}
        />
      </Link>
      <span className='fw-bold ms-20 font-inter fs-23 color-white'>{heading}</span>
    </div>
  )

}

export const HeaderLabel = ({ heading, ...other }) => {

  return (
    <div className='d-flex align-items-center' {...other}>
      <span className='fw-500 font-inter fs-18 color-white'>{heading}</span>
    </div>
  )

}

export const HeaderBreadcrumbs = ({ links, page, ...other }) => {

  return (
    <>
      <Breadcrumb className='color-white font-inter'>
        <BreadcrumbList>
          {links.map((link) => {
            return (
              <>
                <BreadcrumbItem>
                  <Link
                    to={link.url}
                    className='hover-link'
                  >
                    {link.title}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )
          })}
          {/*
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
*/}
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )

}

// HeaderAction.propTypes = {
//   heading: PropTypes.string,
//   action: PropTypes.node,
//   headingStyle: PropTypes.object,
//   headingCustom: PropTypes.node,
//   style: PropTypes.object,
// }
//
// HeaderBreadcrumbs.propTypes = {
//   heading: PropTypes.string,
//   action: PropTypes.node,
//   links: PropTypes.array,
//   style: PropTypes.object,
//   headingStyle: PropTypes.object,
// }

