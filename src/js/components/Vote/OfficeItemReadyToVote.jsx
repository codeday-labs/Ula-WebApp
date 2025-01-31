import { Avatar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import SupportStore from '../../stores/SupportStore';
import VoterGuideStore from '../../stores/VoterGuideStore';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));
const BallotItemSupportOpposeScoreDisplay = React.lazy(() => import(/* webpackChunkName: 'BallotItemSupportOpposeScoreDisplay' */ '../Widgets/ScoreDisplay/BallotItemSupportOpposeScoreDisplay'));


class OfficeItemReadyToVote extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    // console.log("OfficeItemCompressed, this.props.we_vote_id: ", this.props.we_vote_id);
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  onSupportStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  render () {
    renderLog('OfficeItemReadyToVote');  // Set LOG_RENDER_EVENTS to log all renders
    const isSupportArray = [];
    let ballotItemStatSheet;
    let voterSupportsBallotItem;

    this.props.candidateList.forEach((candidate) => {
      if (candidate.we_vote_id) {
        (ballotItemStatSheet = SupportStore.getBallotItemStatSheet(candidate.we_vote_id));
        if (ballotItemStatSheet) {
          ({ voterSupportsBallotItem } = ballotItemStatSheet);
          if (voterSupportsBallotItem) {
            isSupportArray.push(candidate.ballot_item_display_name);
          }
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largestSupportCount = 0;

    if (isSupportArray.length === 0) {
      let numberOfOpposePositionsForScore = 0;
      let numberOfSupportPositionsForScore = 0;

      this.props.candidateList.forEach((candidate) => {
        if (candidate.we_vote_id) {
          (ballotItemStatSheet = SupportStore.getBallotItemStatSheet(candidate.we_vote_id));
          if (ballotItemStatSheet) {
            ({ numberOfOpposePositionsForScore, numberOfSupportPositionsForScore } = ballotItemStatSheet);
            if (numberOfSupportPositionsForScore > numberOfOpposePositionsForScore) {
              if (numberOfSupportPositionsForScore > largestSupportCount) {
                largestSupportCount = numberOfSupportPositionsForScore;
              }
            }
          }
        }
      });
    }
    let candidatePhotoUrl;
    return (
      <>
        <Wrapper>
          { this.props.candidateList.map((oneCandidate) => {
            candidatePhotoUrl = '';
            if (oneCandidate.candidate_photo_url_medium) {
              candidatePhotoUrl = oneCandidate.candidate_photo_url_medium;
            } else if (oneCandidate.candidate_photo_url_large) {
              candidatePhotoUrl = oneCandidate.candidate_photo_url_large;
            }
            const candidatePhotoUrlHtml = (
              <Suspense fallback={<></>}>
                <ImageHandler
                  className="card-main__avatar"
                  sizeClassName="icon-office-child "
                  imageUrl={candidatePhotoUrl}
                  alt=""
                  kind_of_ballot_item="CANDIDATE"
                />
              </Suspense>
            );
            return (
              <React.Fragment key={oneCandidate.we_vote_id}>
                { SupportStore.getVoterSupportsByBallotItemWeVoteId(oneCandidate.we_vote_id) && (
                  <InnerWrapper>
                    <BioColumn>
                      {isCordova() ? candidatePhotoUrlHtml : <Avatar src={candidatePhotoUrl} /> }
                      <BioInformation>
                        <NameText>{oneCandidate.ballot_item_display_name}</NameText>
                        <DesktopTabletView>
                          <DescriptionText>{toTitleCase(oneCandidate.party)}</DescriptionText>
                        </DesktopTabletView>
                        <MobileView>
                          <DescriptionText>{oneCandidate.contest_office_name}</DescriptionText>
                        </MobileView>
                      </BioInformation>
                    </BioColumn>
                    <OfficeColumn>
                      <DesktopTabletView>
                        <OfficeText>{oneCandidate.contest_office_name}</OfficeText>
                      </DesktopTabletView>
                      <BallotItemSupportOpposeCountDisplayWrapper>
                        <Suspense fallback={<></>}>
                          <BallotItemSupportOpposeScoreDisplay ballotItemWeVoteId={oneCandidate.we_vote_id} />
                        </Suspense>
                      </BallotItemSupportOpposeCountDisplayWrapper>
                    </OfficeColumn>
                  </InnerWrapper>
                )}
              </React.Fragment>
            );
          })}
        </Wrapper>
        <HR />
      </>
    );
  }
}
OfficeItemReadyToVote.propTypes = {
  candidateList: PropTypes.array,
};

const styles = ({
});

const BallotItemSupportOpposeCountDisplayWrapper = styled('div')`
  cursor: pointer;
  float: right;
`;

const Wrapper = styled('div')`
  padding: 24px 24px 20px 24px;
  transition: all 200ms ease-in;
  border: 1px solid transparent;
  border-radius: 4px;
`;

const InnerWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  width: 100%;
`;

const BioColumn = styled('div')`
  display: flex;
`;

const OfficeColumn = styled('div')`
  display: flex;
`;

const OfficeText = styled('p')(({ theme }) => (`
  font-size: 18px;
  font-weight: 500;
  margin: auto 0;
  margin-right: 16px;
  ${theme.breakpoints.down('md')} {
    font-size: 14px;
  }
  @media print {
    font-size: 16px !important;
  }
`));

const BioInformation = styled('div')`
  display: flex;
  flex-flow: column;
  margin-left: 8px;
`;

const NameText = styled('h3')`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  @media print{
    font-size: 1.5rem;
  }
`;

const DescriptionText = styled('p')`
  font-size: 12px;
  margin: 0;
  @media print {
    font-size: 1.5rem;
  }
`;

const HR = styled('hr')`
  margin: 0 24px;
`;

const DesktopTabletView = styled('div')(({ theme }) => (`
  display: inherit;
  ${theme.breakpoints.down('sm')} {
    display: none;
  }
`));

const MobileView = styled('div')(({ theme }) => (`
  display: inherit;
  ${theme.breakpoints.up('sm')} {
    display: none;
  }
`));

export default withStyles(styles)(OfficeItemReadyToVote);
