import React, { Component } from "react";
import NavbarMain from "../Layout/NavbarMain";
import "./MyCommunities.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import { getCommunity } from "../../redux/actions/myCommunityActions";

class MyCommunityAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem("userid"),
      communities: [],
      communityName: [],
      totalUsers: [],
      totalPosts: [],
      mostUpvotedPosts: [],
    };
  }

  componentDidMount() {
    const user = localStorage.getItem("userid");
    console.log("current user ID: ", user);
    const data = {
      user: user,
    };
    this.props.getCommunity(data);
  }

  componentWillReceiveProps(nextProps) {
    console.log("----------", nextProps);
    if (nextProps.myCommunity) {
      this.setState({
        communities: nextProps.myCommunity,
      });
    }
    let totalUsers = [];
    let totalPosts = [];
    let communityName = [];
    let posts = [];
    let upvotedPost = 0;
    let mostUpvotedPosts = [];
    let acceptedUser = 0;
    console.log("cdata ---------------comm", nextProps.myCommunity);
    for (let i = 0; i < nextProps.myCommunity.length; i++) {
      communityName.push(nextProps.myCommunity[i].communityName);
      acceptedUser =
        nextProps.myCommunity[i].joinedUsers.length > 0
          ? nextProps.myCommunity[i].joinedUsers.filter(
              (value) => value.acceptStatus === 1
            ).length
          : 0;
      totalUsers.push(acceptedUser);
      totalPosts.push(nextProps.myCommunity[i].totalPost);
      posts = nextProps.myCommunity[i].posts;
      if (nextProps.myCommunity[i].totalPost > 0) {
        for (let j = 0; j < nextProps.myCommunity[i].totalPost; j++) {
          if (j === 0) {
            upvotedPost = posts[j].votes;
          } else {
            if (upvotedPost < posts[j].votes) {
              upvotedPost = posts[j].votes;
            }
          }
        }
        mostUpvotedPosts.push(upvotedPost);
      }
    }
    console.log("----00---", communityName, totalUsers, totalPosts);
    this.setState({
      communityName: communityName,
      totalUsers: totalUsers,
      totalPosts: totalPosts,
      mostUpvotedPosts: mostUpvotedPosts,
    });
  }

  render() {
    let list = this.state.communities;
    console.log("comminaonio", list);
    return (
      <div className="container-fluid">
        <NavbarMain />
        <div className="container">
          <h1 className="mt-2">My Community Analytics</h1>
          <Plot
            data={[
              {
                x: this.state.communityName,
                y: this.state.totalUsers,
                type: "bar",
                name: "Total Users",
              },
              {
                type: "bar",
                x: this.state.communityName,
                y: this.state.totalPosts,
                name: "Total Posts",
              },
            ]}
            layout={{
              width: 1020,
              height: 540,
              title: "Users and Posts Stats",
              barmode: "group",
            }}
          />
          <Plot
            data={[
              {
                x: this.state.communityName,
                y: this.state.mostUpvotedPosts,
                type: "scatter",
                name: "Total Users",
              },
            ]}
            layout={{
              width: 1020,
              height: 540,
              title: "Stats for most Upvoted post",
            }}
          />
        </div>
      </div>
    );
  }
}

MyCommunityAnalytics.propTypes = {
  getCommunity: PropTypes.func.isRequired,
  myCommunity: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    myCommunity: state.myCommunity.myCommunity,
  };
};

export default connect(mapStateToProps, { getCommunity })(MyCommunityAnalytics);
