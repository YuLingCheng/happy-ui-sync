import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { detailedDiff } from 'deep-object-diff';
import getOldColors from './services/getOldColors';
import isColorChange from './services/isColorChange';
import displayReviewPanel from './views/review';
import updateRemoteColors from './services/updateRemoteColors';
import './ui.css';
import './views/loader.css';

enum Step {
  INFO = 'INFO',
  REVIEW = 'REVIEW',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
};

interface StateProps {
  step: Step;
  newColors: Object;
  encodedColorsFile: {
    sha: string
  };
  userName: string;
  userEmail: string;
  token: string;
  repository: string;
  colorsFilepath: string;
  branchRef: string;
  PRLink: string;
}

const initialState = {
  newColors: {},
  encodedColorsFile: {
    sha: ''
  },
  PRLink: '',
};

class App extends React.Component<{}, StateProps> {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.INFO,
      userName: '',
      userEmail: '',
      token: '',
      repository: '',
      colorsFilepath: '',
      branchRef: '',
      ...initialState
    };
  }

  handleChange = (value: string) => (event) => {
    this.setState({ [value]: event.target.value } as Pick<StateProps, keyof StateProps>);
  }

  sendStyleChanges = event => {
    event.preventDefault();
    // Save info to figma storage
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SAVE_INFO',
          userName: this.state.userName,
          userEmail: this.state.userEmail,
          repository: this.state.repository,
          colorsFilepath: this.state.colorsFilepath,
          branchRef: this.state.branchRef
        }
      },
      '*'
    );
    // Get new colors
    parent.postMessage({ pluginMessage: { type: 'GET_NEW_COLORS' } }, '*');
  };

  goToStep = (step: Step) => () => {
    if (step === Step.INFO) {
      this.setState(initialState);
    }
    this.setState({ step });
  }

  validateChanges = async event => {
    event.preventDefault();

    console.info('New Colors to send to repo', this.state.newColors);

    //Send colors to Repo
    this.goToStep(Step.LOADING)();
    const PRLink = await updateRemoteColors(this.state.newColors, {
      token: this.state.token,
      sha: this.state.encodedColorsFile.sha,
      userName: this.state.userName,
      userEmail: this.state.userEmail,
      repository: this.state.repository,
      colorsFilepath: this.state.colorsFilepath,
      branchRef: this.state.branchRef
    });

    this.setState({ PRLink });
    this.goToStep(Step.SUCCESS)();
  };

  componentDidMount() {
    onmessage = async event => {
      const { pluginMessage } = event.data;

      switch (pluginMessage.type) {
        case 'REHYDRATE_INFO':
          // Fill info from localStorage
          if (pluginMessage.name) {
            this.setState({ userName: pluginMessage.name });
          }
          if (pluginMessage.email) {
            this.setState({ userEmail: pluginMessage.email });
          }
          if (pluginMessage.repository) {
            this.setState({ repository: pluginMessage.repository });
          }
          if (pluginMessage.colorsFilepath) {
            this.setState({ colorsFilepath: pluginMessage.colorsFilepath });
          }
          if (pluginMessage.branchRef) {
            this.setState({ branchRef: pluginMessage.branchRef });
          }
          break;
        case 'NEW_COLORS':
          this.setState({ newColors: pluginMessage.newColors })
          const { oldColors, encodedColorsFile } = await getOldColors(
            this.state.repository,
            this.state.colorsFilepath,
            this.state.branchRef,
            this.state.token
          );
          this.setState({ encodedColorsFile });

          const colorDiff = detailedDiff(oldColors, this.state.newColors);
          if (isColorChange(colorDiff)) {
            this.goToStep(Step.REVIEW)();
            displayReviewPanel(colorDiff, oldColors);
          }
          break;
      }
    };
  }

  render() {
    return <>
      {this.state.step === Step.INFO && <form id="send-style-changes" onSubmit={this.sendStyleChanges}>
        <p>
          This plugin helps you export your local styles (colors...) to the code
          repository of your project.
        </p>
        <p>
          We'll grab the styles defined in the current Figma project and create a pull
          request to update the project code.
        </p>
        <p className="info-banner">
          <span className="info-icon">?</span>Step 1/2: Make sure your information are correct
        </p>
        <div className="form-container">
          <p>
            <label className="text-input-label">Name*
            <br />
              <input
                id="name-input"
                onChange={this.handleChange('userName')}
                value={this.state.userName}
              />
            </label>
          </p>
          <p>
            <label className="text-input-label">Email*
            <br />
              <input
                id="email-input"
                onChange={this.handleChange('userEmail')}
                value={this.state.userEmail}
              />
            </label>
          </p>
          <p>
            <label className="text-input-label">
              Github Personnal Access Token*
              <br />
              <input
                id="token"
                type="password"
                onChange={this.handleChange('token')}
                value={this.state.token}
              />
            </label>
          </p>
          <p>
            <label className="text-input-label">
              Github Repository Name*
              <br />
              <input
                id="repository-input"
                placeholder="GithubNamespace/repository"
                onChange={this.handleChange('repository')}
                value={this.state.repository}
              />
            </label>
          </p>
          <p>
            <label className="text-input-label">
              Colors file path*
              <br />
              <input
                id="colorsfilepath-input"
                placeholder="src/globals/colors.json"
                onChange={this.handleChange('colorsFilepath')}
                value={this.state.colorsFilepath}
              />
            </label>
          </p>
          <p>
            <label className="text-input-label"
            >
              Branch reference*
              <br />
              <input
                id="branchref-input"
                placeholder="master"
                onChange={this.handleChange('branchRef')}
                value={this.state.branchRef}
              />
            </label>
          </p>
        </div>
        <div className="validate-section">
          <button type="submit" id="send">Export colors</button>
        </div>
      </form>
      }
      {this.state.step === Step.REVIEW && <div id="confirmation-panel">
        <p className="info-banner">
          <span className="info-icon">?</span>Step 2/2: Review your changes
        </p>
        <div id="review-panel"></div>
        <div className="validate-section">
          <button
            type="submit"
            id="back-step-1"
            className="ghost"
            onClick={this.goToStep(Step.INFO)}
          >Back</button>
          <button type="submit" onClick={this.validateChanges} id="validate">Validate</button>
        </div>
      </div>
      }
      {this.state.step === Step.SUCCESS && <div id="success-panel">
        <p className="success-banner">
          ✅ Your changes were successfully sent! Share your work with the developers
        </p>
        <div className="form-container">
          <a
            id="pull-request-link"
            target="_blank"
            rel="noopener"
            href={this.state.PRLink}
          >{this.state.PRLink}</a>
          <input id="pull-request-input" />
        </div>
        <p>
          <button
            type="submit"
            id="back-step-1-bis"
            className="ghost"
            onClick={this.goToStep(Step.INFO)}
          >Back</button>
          <button id="copy-url-button">Copy the URL</button>
          <span id="url-copied">URL copied</span>
        </p>
      </div>
      }
      {this.state.step === Step.LOADING && <div id="loader-panel">
        <div className="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
      }
    </>
  }
}

ReactDOM.render(<App />, document.getElementById('plugin-body'))