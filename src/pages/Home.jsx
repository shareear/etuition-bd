import React from 'react';
import Banner from '../components/shared/Banner';
// import LatestTuitions from '../components/shared/LatestTuitions';
import HowItWorks from '../components/HowItWorks';
import StatsCounter from '../components/Stats';
import Brands from '../components/Brands';
import FeaturedTuitions from '../components/shared/FeaturesTuition';
import FeedBack from '../components/FeedBack';
import FeaturedTutors from '../components/FeaturedTutors';
import NewStudents from '../components/NewStudents';
// import PopularTutors from '../components/Tutors';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedTuitions></FeaturedTuitions>
            <StatsCounter></StatsCounter>
            <FeaturedTutors></FeaturedTutors>
            <NewStudents></NewStudents>
            <HowItWorks></HowItWorks>
            <FeedBack></FeedBack>
            <Brands></Brands>
        </div>
    );
};

export default Home;