import fetch from 'node-fetch'
import Topbar from "../../components/Topbar";
import Router from 'next/router'
import { Layout, Breadcrumb, Carousel, Col, Row, Card } from "antd";
import PageFooter from "../../components/Footer";
import RouteStats from "../../components/RouteStats";
import RouteIntro from "../../components/RouteIntro";
import RouteBeta from "../../components/RouteBeta";
import RouteLinks from "../../components/RouteLinks";
import RouteHistory from "../../components/RouteHistory";

const { Content } = Layout;

export default function Route({route, status}) {

    if (status != 200) return <p>{route.message}</p>;
    return (
        <div>
            <Topbar onBack={() => Router.back()} title={route.title} subTitle={route.subtitle}/>
            <Layout style={{paddingTop: '64px'}} className="site-layout">
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Routes</Breadcrumb.Item>
                        <Breadcrumb.Item>{route.title}</Breadcrumb.Item>
                        <Content style={{padding: '20px', maxWidth: '1500px', margin: '0 auto'}}>
                            <Row gutter={16}>
                                <Col span={8} md={8} sm={12} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteStats/>
                                </Col>
                                <Col span={8} md={8} sm={12} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteIntro/>
                                </Col>
                                <Col span={8} md={8} sm={12} xs={24} style={{margin: '8px 0px'}}>
                                    <Card style={{height: '100%'}}>
                                        <Carousel autoplay>
                                            <div>
                                                <img alt="image1" style={{ width: '100%', height: '100%' }} src="/static/routes/superalpine/cover.jpg" />
                                            </div>
                                            <div>
                                                <img alt="image2" style={{ width: '100%', height: '100%' }} src="/static/routes/ice-cliff/cover.jpg" />
                                            </div>
                                        </Carousel>
                                    </Card>
                                </Col>
                            </Row>
                            <RouteBeta/>
                            <Row gutter={16} style={{paddingBottom: '8px'}}>
                                <Col span={16} md={16} sm={16} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteHistory/>
                                </Col>
                                <Col span={8} md={8} sm={8} xs={24} style={{margin: '8px 0px'}}>
                                    <RouteLinks/>
                                </Col>
                            </Row>
                            {/*<style jsx>{`*/}
                            {/*  .ant-card {*/}
                            {/*    padding: 8px 0px;*/}
                            {/*  }*/}
                            {/*`}</style>*/}
                        </Content>

                    </Breadcrumb>
                </Content>
                <PageFooter/>
            </Layout>
        </div>
    )
}

export async function getServerSideProps({ params }) {
    const response = await fetch(`http://localhost:3000/api/routes/${params.rid}`)
    const route = await response.json()

    return {
        props: {route: route, status: response.status}
    }
}