import React from "react";

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderClass = (scale) => {
    if (scale === null) return "";
    if (scale === true) return "sidebar-scale-up";
    if (scale === false) return "sidebar-scale-down";
  };

  render() {
    return (
      <div
        className={
          "bg-light border-right " + this.renderClass(this.props.scale)
        }
        id="sidebar-wrapper"
      >
        <div
          className={"sidebar-heading " + this.renderClass(this.props.scale)}
        >
          Start Bootstrap{" "}
        </div>
        <div
          className={
            "list-group list-group-flush " + this.renderClass(this.props.scale)
          }
        >
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Dashboard
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Shortcuts
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Overview
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Events
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Profile
          </a>
          <a
            href="#"
            className={
              "list-group-item list-group-item-action bg-light " +
              this.renderClass(this.props.scale)
            }
          >
            Status
          </a>
        </div>
      </div>
    );
  }
}

export default MainSidebar;
