import { makeApiCall } from "./fetch";

const generateBranchName = () =>
  `refs/heads/update-colors-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")
    .replace("T", "-")}`;

const getLastCommitSha = async (token, repository, branchRef) => {
  const response = await makeApiCall(
    `git/matching-refs/heads/${branchRef}`,
    repository,
    {
      token,
    }
  );
  return response[0].object.sha;
};

const createBranch = async (branchName, token, repository, branchRef) => {
  const sha = await getLastCommitSha(token, repository, branchRef);

  return makeApiCall(`git/refs`, repository, {
    method: "POST",
    token,
    body: {
      ref: branchName,
      sha,
    },
  });
};

const updateColorsJsonContent = (
  sha,
  newContent,
  repository,
  colorsFilepath,
  branch,
  token,
  userName,
  userEmail
) =>
  makeApiCall(`contents/${colorsFilepath}`, repository, {
    method: "PUT",
    token,
    body: {
      message: "feat(sync): Update colors from Figma local styles",
      content: window.btoa(JSON.stringify(newContent, null, 2)),
      branch,
      committer: {
        name: userName,
        email: userEmail,
      },
      sha,
    },
  });

const createPullRequest = (
  repository,
  branchName,
  token,
  username,
  email,
  branchRef
) =>
  makeApiCall(`pulls`, repository, {
    method: "POST",
    token,
    body: {
      title: "Update colors from Figma",
      head: branchName,
      base: branchRef,
      body: `Apply colors changes from Figma local styles\n Author: ${username} — email: ${email}`,
    },
  });

const updateRemoteColors = async (
  newContent,
  { token, sha, userName, userEmail, repository, colorsFilepath, branchRef }
) => {
  const newBranchName = generateBranchName();

  try {
    await createBranch(newBranchName, token, repository, branchRef);
  } catch (error) {
    console.error("Could not create a new branch on Github", {
      newBranchName,
      repository,
      branchRef,
      error,
    });
    throw Error(
      `Could not create a new branch on Github. ${error.message} (Please check your credentials)`
    );
  }

  try {
    await updateColorsJsonContent(
      sha,
      newContent,
      repository,
      colorsFilepath,
      newBranchName,
      token,
      userName,
      userEmail
    );
  } catch (error) {
    console.error("Could push the new colors to the new branch", {
      lastCommitSha: sha,
      newContent,
      repository,
      colorsFilepath,
      newBranchName,
      userName,
      userEmail,
      error,
    });
    throw Error(
      `Could push the new colors to the new branch. ${error.message}`
    );
  }

  try {
    const response = await createPullRequest(
      repository,
      newBranchName,
      token,
      userName,
      userEmail,
      branchRef
    );

    return response.html_url;
  } catch (error) {
    console.error("Could not create a pull request on Github", {
      repository,
      newBranchName,
      userName,
      userEmail,
      branchRef,
      error,
    });
    throw Error(`Could not create a pull request on Github. ${error.message}`);
  }
};

export default updateRemoteColors;
