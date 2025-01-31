import { Button } from '@mui/material';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import VoterStore from '../../stores/VoterStore';
import { sentenceCaseString } from '../../utils/textFormat';


export default class SelectVoterGuidesSideBarLink extends Component {
  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    this.setState({
      linkedOrganizationWeVoteId,
    });
  }

  goToEditLink = () => {
    const { voterGuideWeVoteId } = this.props;
    const editLink = `/vg/${voterGuideWeVoteId}/settings/positions`;
    historyPush(editLink);
  }

  goToPreviewLink = () => {
    const { electionId } = this.props;
    const { linkedOrganizationWeVoteId } = this.state;
    const previewLink = `/voterguide/${linkedOrganizationWeVoteId}/ballot/election/${electionId}/positions`;
    historyPush(previewLink);
  }

  render () {
    // console.log('voterGuideWeVoteId:', this.props.voterGuideWeVoteId);
    renderLog('SelectVoterGuidesSideBarLink');  // Set LOG_RENDER_EVENTS to log all renders
    const labelInSentenceCase = toTitleCase(this.props.label);
    const subtitleInSentenceCase = sentenceCaseString(this.props.subtitle);

    return (
      <span>
        {labelInSentenceCase && labelInSentenceCase !== '' ? (
          <Wrapper>
            <Content>
              <Name onClick={this.goToEditLink}>
                {labelInSentenceCase}
              </Name>
              { this.props.displaySubtitles ? (
                <Date onClick={this.goToEditLink}>
                  {subtitleInSentenceCase}
                </Date>
              ) : null }
              <ButtonWrapper>
                <ButtonContainer>
                  <Button
                    id="selectVotingGuidesSideBarLinkEdit"
                    color="primary"
                    fullWidth
                    onClick={this.goToEditLink}
                    variant="contained"
                  >
                    Edit
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    id="selectVotingGuidesSideBarLinkPreview"
                    fullWidth
                    onClick={this.goToPreviewLink}
                    variant="outlined"
                  >
                    Preview
                  </Button>
                </ButtonContainer>
              </ButtonWrapper>
            </Content>
          </Wrapper>
        ) :
          null}
      </span>
    );
  }
}
SelectVoterGuidesSideBarLink.propTypes = {
  label: PropTypes.string,
  subtitle: PropTypes.string,
  displaySubtitles: PropTypes.bool,
  electionId: PropTypes.number,
  voterGuideWeVoteId: PropTypes.string,
};

const Wrapper = styled('div')`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  width: 100%;
`;

const Content = styled('div')`

`;

const Name = styled('h3')`
  color: black !important;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 4px;
`;

const Date = styled('small')`
  color: #666;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
`;

const ButtonWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  @media (min-width: 768px) and (max-width: 868px) {
    flex-direction: column;
  }
`;

const ButtonContainer = styled('div')`
  &:first-child {
    margin-bottom: 0;
    margin-right: 8px;
  }
  width: 50%;
  @media (min-width: 768px) and (max-width: 868px) {
    &:first-child {
      margin-right: 0;
      margin-bottom: 8px;
    }
    width: 100%;
  }
`;
