import Slider from "./slider";
import Page_NewsData from "../../apis/page_news/page_newsData";

export default async function SliderSection({ locale }) {
  const slider_Data = await Page_NewsData(1, locale);
  const data_slider = slider_Data?.results?.slice(0, 5) || [];
  return <Slider serverData={data_slider} />;
}