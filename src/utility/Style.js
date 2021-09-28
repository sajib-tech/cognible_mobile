import Color from './Color';
import {
    Dimensions, Platform
} from 'react-native'
const { width, height } = Dimensions.get('window');
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export default {
    backgroundSplashScreen: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    picker: {
        height: 50,
        borderColor: Color.gray,
        borderWidth: 1, paddingLeft: 8,
        borderRadius: 6, marginVertical: 4,
        justifyContent: 'center'
    },
    logoSplashScreen: {
        alignSelf: 'center',
        width: '50%',
        height: '50%',
        position: 'absolute',
        resizeMode: 'contain',
    },
    marginTopIOS: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? getStatusBarHeight() + 3 : 0,
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() + 4 : 0,
        backgroundColor: Color.grayWhite
    },
    content: {
        flex: 1,
        // marginTop: getStatusBarHeight(),
        paddingHorizontal: 16,
        backgroundColor: Color.grayWhite,
    },
    inContent: {
        flex: 1,
        marginHorizontal: 5, marginVertical: 5,
        backgroundColor: Color.white,
    },
    labelTitle: {
        marginHorizontal: 20, marginVertical: 10,
        color: Color.black, fontSize: 16
    },
    imageProfile: {
        width: width / 2.4, height: width / 2.4, borderRadius: width / 2.4,
        // borderColor: Color.primary, borderWidth: 1,
        // backgroundColor: Color.primary,
        alignSelf: 'center',
        // justifyContent: 'center', alignItems: 'center',
        // marginBottom: 10,
        resizeMode: 'cover'
    },
    iconCircle: {
        width: 30, height: 30, borderRadius: 30, backgroundColor: Color.grayFill,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10, padding: 5
    },
    iconCircle: {
        width: 30, height: 30, borderRadius: 30, backgroundColor: Color.grayFill,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10, padding: 5
    },
    imageCircle: {
        width: 75, height: 75, borderRadius: 75, backgroundColor: Color.grayFill,
        justifyContent: 'center', alignItems: 'center', marginTop: 10
    },
    smallCircle: {
        width: 45, height: 45, borderRadius: 50,
        backgroundColor: Color.primary, borderWidth: 2, borderColor: Color.yellowFill,
        justifyContent: 'center', alignItems: 'center'
    },
    sideMenuContainer: {
        flex: 1, backgroundColor: Color.primary
    },
    sideMenu: {
        flex: 1, paddingVertical: 5, marginVertical: 10
    },
    tombolSide: {
        flexDirection: 'row', borderBottomWidth: 1,
        borderColor: Color.white, paddingVertical: 10,
        alignItems: 'center', marginVertical: 2, marginHorizontal: 15,
    },
    HeaderContainer: {
        // height: 130,
        flex: 1,
        backgroundColor: Color.grayWhite,
        // alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: getStatusBarHeight(),
        // paddingVertical:16,
        //  borderBottomWidth:1, borderBottomColor:Color.white
    },
    verySmallImageCircle: {
        width: 40, height: 40, borderRadius: 40, backgroundColor: Color.grayFill,
        justifyContent: 'center', alignItems: 'center', borderColor: Color.white,
        borderWidth: 2
    },
    backgroundBerita: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
        borderRadius: 8
    },
    leftIconStyle: {
        marginRight: 15
    },
    searchInput: {
        borderWidth: 1, borderColor: Color.grayFill, borderRadius: 3, paddingHorizontal: 15, height: 40
    },
    margin: {
        margin: 5
    },
    input: {
        marginVertical: 10,
        padding: 6,
        borderRadius: 6,
        borderColor: '#DCDCDC',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row'
    },
    flexWrap: {
        flex: 1, width,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    iconSmall: {
        width: 45, height: 45, alignSelf: 'center',
        textAlign: 'center', backgroundColor: Color.white,
        padding: 10, marginRight: 10
    },
    center: {
        justifyContent: 'center', alignItems: 'center'
    },
    row: {
        flex: 1, flexDirection: 'row'
    },
    rowBetween: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    },
    rowAround: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-around',
    },
    rowCenter: {
        flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    column: {
        flex: 1, flexDirection: 'column'
    },
    columnCenter: {
        flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    },
    textCenter: {
        textAlign: 'center', color: Color.black
    },
    textRight: {
        textAlign: 'right', color: Color.black
    },
    smallPrimaryFontText: {
        color: Color.primaryFont,
        fontSize: 10,
    },
    smallPrimaryFontTextBold: {
        color: Color.primaryFont,
        fontSize: 10, fontWeight: 'bold'
    },
    primaryFontText: {
        color: Color.primaryFont,
        fontSize: 14,
    },
    primaryFontBold: {
        color: Color.primaryFont,
        fontSize: 14, fontWeight: 'bold'
    },
    bigPrimaryFontText: {
        color: Color.primaryFont,
        fontSize: 16
    },
    bigPrimaryFontTextBold: {
        color: Color.primaryFont,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigPrimaryFontText: {
        color: Color.primaryFont,
        fontSize: 18
    },
    veryBigPrimaryFontTextBold: {
        color: Color.primaryFont,
        fontSize: 18, fontWeight: 'bold'
    },
    smallSecondaryFontText: {
        color: Color.secondaryFont,
        fontSize: 10,
    },
    smallSecondaryFontTextBold: {
        color: Color.secondaryFont,
        fontSize: 10, fontWeight: 'bold'
    },
    secondaryFontText: {
        color: Color.secondaryFont,
        fontSize: 14,
    },
    secondaryFontBold: {
        color: Color.secondaryFont,
        fontSize: 14, fontWeight: 'bold'
    },
    bigSecondaryFontText: {
        color: Color.secondaryFont,
        fontSize: 16
    },
    bigSecondaryFontTextBold: {
        color: Color.secondaryFont,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigSecondaryFontText: {
        color: Color.secondaryFont,
        fontSize: 18
    },
    veryBigSecondaryFontTextBold: {
        color: Color.secondaryFont,
        fontSize: 18, fontWeight: 'bold'
    },
    //Gray font
    smallGrayText: {
        color: Color.grayFill,
        fontSize: 14,
    },
    smallGrayTextBold: {
        color: Color.grayFill,
        fontSize: 10, fontWeight: 'bold'
    },
    grayText: {
        color: Color.grayFill,
        fontSize: 14,
    },
    grayTextBold: {
        color: Color.grayFill,
        fontSize: 14, fontWeight: 'bold'
    },
    bigGrayText: {
        color: Color.grayFill,
        fontSize: 16
    },
    bigGrayTextBold: {
        color: Color.grayFill,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigGrayText: {
        color: Color.grayFill,
        fontSize: 18
    },
    veryBigGrayTextBold: {
        color: Color.grayFill,
        fontSize: 18, fontWeight: 'bold'
    },
    //white font
    smallWhiteText: {
        color: Color.white,
        fontSize: 10
    },
    smallWhiteTextBold: {
        color: Color.white,
        fontSize: 10, fontWeight: 'bold'
    },
    whiteText: {
        color: Color.white,
        fontSize: 14,
    },
    whiteTextBold: {
        color: Color.white,
        fontSize: 14, fontWeight: 'bold'
    },
    bigWhiteText: {
        color: Color.white,
        fontSize: 16
    },
    bigWhiteTextBold: {
        color: Color.white,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigWhiteText: {
        color: Color.white,
        fontSize: 18
    },
    veryBigWhiteTextBold: {
        color: Color.white,
        fontSize: 18, fontWeight: 'bold'
    },
    //yellow font
    smallYellowText: {
        color: Color.yellowFill,
        fontSize: 14,
    },
    smallYellowTextBold: {
        color: Color.yellowFill,
        fontSize: 10, fontWeight: 'bold'
    },
    yellowText: {
        color: Color.yellowFill,
        fontSize: 14,
    },
    yellowTextBold: {
        color: Color.yellowFill,
        fontSize: 14, fontWeight: 'bold'
    },
    bigYellowText: {
        color: Color.yellowFill,
        fontSize: 16
    },
    bigYellowTextBold: {
        color: Color.yellowFill,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigYellowText: {
        color: Color.yellowFill,
        fontSize: 18
    },
    veryBigYellowTextBold: {
        color: Color.yellowFill,
        fontSize: 18, fontWeight: 'bold'
    },
    //black font
    smallBlackText: {
        color: Color.black,
        fontSize: 10,
    },
    smallBlackTextBold: {
        color: Color.black,
        fontSize: 10, fontWeight: 'bold'
    },
    blackText: {
        color: Color.black,
        fontSize: 14,
    },
    blackTextBold: {
        color: Color.black,
        fontSize: 14, fontWeight: 'bold'
    },
    bigBlackText: {
        color: Color.black,
        fontSize: 16
    },
    bigBlackTextBold: {
        color: Color.black,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigBlackText: {
        color: Color.black,
        fontSize: 18
    },
    veryBigBlackTextBold: {
        color: Color.black,
        fontSize: 18, fontWeight: 'bold'
    },
    //primary font
    smallPrimaryText: {
        color: Color.primary,
        fontSize: 14,
    },
    smallPrimaryTextBold: {
        color: Color.primary,
        fontSize: 10, fontWeight: 'bold'
    },
    primaryText: {
        color: Color.primary,
        fontSize: 14,
    },
    primaryTextBold: {
        color: Color.primary,
        fontSize: 14, fontWeight: 'bold'
    },
    bigPrimaryText: {
        color: Color.primary,
        fontSize: 16
    },
    bigPrimaryTextBold: {
        color: Color.primary,
        fontSize: 16, fontWeight: 'bold'
    },
    veryBigPrimaryText: {
        color: Color.primary,
        fontSize: 18
    },
    veryBigrimaryTextBold: {
        color: Color.primary,
        fontSize: 18, fontWeight: 'bold'
    },
    logoSign: {
        alignSelf: 'center',
        width: '45%',
        height: '45%',
        resizeMode: 'contain',
        // marginVertical: 10
    },
    componentContainer: {
        marginVertical: 10,
        height: 65,
    },
    textInput: {
        marginVertical: 8,
        borderColor: Color.grayFill, borderWidth: 1
    },
    textInputPassword: {
        flex: 1, height: 50,
        marginVertical: 8,
        borderColor: Color.grayFill, borderWidth: 1
    },

    pickerDate: {
        flex: 1, height: 30, borderColor: Color.grayFill,
        borderWidth: 1, borderRadius: 3, justifyContent: 'center',
        marginTop: 5
    }
}