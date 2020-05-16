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
  await createBranch(newBranchName, token, repository, branchRef);
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
  const { html_url } = await createPullRequest(
    repository,
    newBranchName,
    token,
    userName,
    userEmail,
    branchRef
  );

  return html_url;
};

export default updateRemoteColors;
