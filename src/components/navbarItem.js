import React from 'react';

function NavbarItem({ render, ...props }) {
  if (render) {
    const ativo =
      props.href && props.href !== '/' && window.location.pathname.startsWith(props.href);
    return (
      <li className={`nav-item${ativo ? ' active' : ''}`}>
        <a onClick={props.onClick} className='nav-link' href={props.href}>
          {props.label}
        </a>
      </li>
    );
  } else {
    return false;
  }
}

export default NavbarItem;
