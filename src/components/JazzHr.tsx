import React, { useState, useEffect } from "react";
import base64 from "base-64";
import moment from "moment";
import { IActivity  } from '../interfaces';
import { SERVER_URL, DATE_FORMAT } from "../config/config";

let headers = new Headers();
headers.append(
  "Authorization",
  "Basic " + base64.encode("code_challenge:BhfUzYiUsdqjp4Ffeqg9@P")
);

const JazzHr = () => {
  const [date, setDate] = useState<any>(new Date());
  const [activities, setActivities] = useState();
  useEffect(() => {
    fetch(SERVER_URL, {
      method: "GET",
      headers: headers
    })
      .then(res => res.json())
      .then(
        result => {
          setActivities(result);
        },
        error => { console.error('API Error', error) }
      );
  }, [date]);


  let filteredData =
    activities &&
    activities.filter((item: IActivity) => {
      return (
        date.toString() === moment(item.transitionedAt).format(DATE_FORMAT)
      );
    });

  let count: any = {
    New: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Hired: 0,
    "Not Hired": 0
  };

  filteredData &&
    filteredData.forEach((itm: any) => {
      count[itm.statusTo] += 1;
    });

  return (
    <div className="code-challenge">
      <input
        onChange={value => {
          setDate(moment(value.target.value).format(DATE_FORMAT));
        }}
        type="date"
        value={date}
      />

      <h2>Output:</h2>
      <table cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>          
        </thead>
        <tbody>
          {count &&
            Object.entries(count).map((item: any, index: number) => {
              return (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default JazzHr;
