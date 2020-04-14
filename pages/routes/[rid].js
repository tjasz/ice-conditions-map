import Topbar from "../../components/Topbar";
import Link from "next/link";
import { Layout, Breadcrumb, Col, Row} from "antd";
import PageFooter from "../../components/Footer";
import RouteStats from "../../components/RouteStats";
import RouteIntro from "../../components/RouteIntro";
import RouteBeta from "../../components/RouteBeta";
import RouteLinks from "../../components/RouteLinks";
import RouteHistory from "../../components/RouteHistory";
import RoutePhotos from "../../components/RoutePhotos";
import { RouteObject } from "../../objects/RouteObject"
import fs from 'fs'
import path from 'path'
import { getRoutes} from "../../utils/DataLoader";
import RouteStory from "../../components/RouteStory";
import NavigationDropdown from "../../components/NavigationDropdown";
import Head from 'next/head'
import Lightbox from 'react-image-lightbox';
import React from "react";
import 'react-image-lightbox/style.css';

const { Content } = Layout;

export default class Route extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            photoIsOpen: false,
        };
    }

    onPhotoClick = index => {
        this.setState({
            photoIndex: index,
            photoIsOpen: true
        })
    }

    render() {
        const {photoIsOpen, photoIndex} = this.state
        const route = new RouteObject(this.props.data)
        const images = route.imgs
        const extras = route.content.extra.story == null ?
            (<Row gutter={16} style={{paddingBottom: '8px'}}>
                <Col span={16} md={16} sm={24} xs={24} style={{margin: '8px 0px'}}>
                    <RouteHistory route={route}/>
                </Col>
                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                    <RouteLinks route={route}/>
                </Col>
            </Row>) :
            (<Row gutter={16} style={{paddingBottom: '8px'}}>
                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                    <RouteHistory route={route}/>
                </Col>
                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                    <RouteStory route={route}/>
                </Col>
                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                    <RouteLinks route={route}/>
                </Col>
            </Row>);

        const photoLightbox = !photoIsOpen ? null :
            <Lightbox
                mainSrc={images[photoIndex]}
                nextSrc={images[(photoIndex + 1) % images.length]}
                prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                onCloseRequest={() => this.setState({ photoIsOpen: false })}
                onMovePrevRequest={() =>
                    this.setState({ photoIndex: (photoIndex + images.length - 1) % images.length})
                }
                onMoveNextRequest={() =>
                    this.setState({photoIndex: (photoIndex + 1) % images.length})
                }
            />;

        return (
            <div>
                <Head>
                    <title>{route.getTitle()} | Cascade Ice</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Topbar title={route.name}
                        subTitle={route.peak}
                        extra={[
                            <NavigationDropdown options={['home', 'map', 'routes']}/>
                        ]}
                />
                <Layout style={{paddingTop: '55px'}} className="site-layout">
                    <Content style={{ padding: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }} key="home">
                            <Breadcrumb.Item><Link href="/"><a>Home</a></Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link href="/routes"><a>Routes</a></Link></Breadcrumb.Item>
                            <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{padding: '10px', maxWidth: '1500px', margin: '0 auto'}}>
                            <Row gutter={16}>
                                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteStats route={route}/>
                                </Col>
                                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteIntro route={route}/>
                                </Col>
                                <Col span={8} md={8} sm={24} xs={24} style={{margin: '8px 0px'}}>
                                    <RoutePhotos route={route} onPhotoClick={this.onPhotoClick}/>
                                </Col>
                            </Row>
                            <RouteBeta route={route}/>
                            {extras}
                        </Content>
                    </Content>
                    <PageFooter/>
                    {photoLightbox}
                </Layout>

            </div>
        )
    }
}

// Props created at build time for static rendering.
export async function getStaticProps({ params }) {
    const route = getRoutes().filter(r => params.rid === r.rid)[0]
    const routeDir = path.join(process.cwd(), route.routeDir)

    // can have a story or not
    let story = null;
    try {story = fs.readFileSync(path.join(routeDir, 'story.html'), 'utf8')} catch(e) { null; }

    route.content = {
        intro: fs.readFileSync(path.join(routeDir, 'intro.html'), 'utf8'),
        beta: {
            approach: fs.readFileSync(path.join(routeDir, 'approach.html'), 'utf8'),
            climb: fs.readFileSync(path.join(routeDir, 'climb.html'), 'utf8'),
            descent: fs.readFileSync(path.join(routeDir, 'descent.html'), 'utf8'),
            gear: fs.readFileSync(path.join(routeDir, 'gear.html'), 'utf8'),
            conditions: fs.readFileSync(path.join(routeDir, 'conditions.html'), 'utf8'),
            strategy: fs.readFileSync(path.join(routeDir, 'strategy.html'), 'utf8')
        },
        extra: {
            history: fs.readFileSync(path.join(routeDir, 'history.html'), 'utf8'),
            story: story,
            links: fs.readFileSync(path.join(routeDir, 'links.html'), 'utf8')
        }
    }

    route.imgs = fs.readdirSync(path.join(routeDir, 'imgs')).map(f => path.join(route.imgDir, "imgs", f))

    return {
        props: {data: route}
    }
}

// Define which paths will be statically build at build time.
export async function getStaticPaths() {
    return {
        paths: getRoutes().map(r => ({ params: { rid: r.rid } })),
        fallback: false // show 404 error if route page not found
    };
}