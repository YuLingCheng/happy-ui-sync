import { makeApiCall } from './fetch';

const generateBranchName = () =>
  `refs/heads/update-color-${Math.random()
    .toString(36)
    .substr(2, 16)}`;

const getLastCommitSha = async (token, repository, branchRef) => {
  const response = await makeApiCall(
    `git/matching-refs/heads/${branchRef}`,
    repository,
    {
      token
    }
  );
  return response[0].object.sha;
};

const createBranch = async (branchName, token, repository, branchRef) => {
  const sha = await getLastCommitSha(token, repository, branchRef);

  return makeApiCall(`git/refs`, repository, {
    method: 'POST',
    token,
    body: {
      ref: branchName,
      sha
    }
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
    method: 'PUT',
    token,
    body: {
      message: 'feat(sync): applying Figma colors update',
      content: window.btoa(JSON.stringify(newContent, null, 2)),
      branch,
      committer: {
        name: userName,
        email: userEmail
      },
      sha
    }
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
    method: 'POST',
    token,
    body: {
      title: 'Updating new colors from Figma design',
      head: branchName,
      base: branchRef,
      body: `Applying colors changes made on Figma by ${username} \n [contact: ${email}]`
    }
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
