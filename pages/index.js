import {Breadcrumb, Col, Layout, Row} from 'antd';
import "../style.less";
import Topbar from "../components/Topbar";
import PageFooter from "../components/Footer";
import React from "react";
import RouteCard from "../components/RouteCard";
import RouteSelectionSidebar from "../components/RouteSelectionSidebar";
import fetch from 'node-fetch'
import { getUrl } from "../utils/HttpUtil"

const { Content } = Layout;

export default function Index(props) {

    const routeCards = props.routes.map(r =>
        <Col span={6} md={6} sm={12} xs={24} key={r.rid}>
            <RouteCard route={r}/>
        </Col>
    );
    return (
        <div>
            <Topbar title="WA Ice" subTitle="The Elusive Beast"/>
            <Layout style={{paddingTop: '64px'}}>
                <RouteSelectionSidebar />
                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Routes</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row gutter={16}>
                            {routeCards}
                        </Row>
                    </Content>
                    <PageFooter/>
                </Layout>
            </Layout>
        </div>
    )

}

export async function getServerSideProps() {
    const response = await fetch(getUrl('api/routes'))
    const routes = await response.json()
    return { props: { routes : routes } }
}

