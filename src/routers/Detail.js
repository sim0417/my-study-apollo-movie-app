import React from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Movie from "components/Movie";

const Container = styled.div`
  position: relative;
  height: 100%;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
`;

const MovieInfo = styled.div`
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const Subtitle = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1.25rem;
`;

const Poster = styled.div`
  width: 25%;
  height: 60%;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
`;

const Suggestions = styled.div`
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Movies = styled.div`
  width: 60%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 25px;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  text-transform: uppercase;

  transition: color 0.3s ease-in-out;

  &:hover {
    color: #28ff3f;
  }
`;

const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      overview
      release_date
      vote_average
      poster_path
      genres {
        name
      }
      original_language
    }
    suggestions(id: $id) {
      id
      title
      poster_path
    }
  }
`;

const POSTER_URL = "https://image.tmdb.org/t/p/original";

export default () => {
  window.scrollTo(0, 0);
  const { id } = useParams();
  const parsedId = parseInt(id);
  const { loading, data } = useQuery(GET_MOVIE, {
    variables: { id: parsedId },
  });

  return (
    <Container>
      <BackLink to="/">Home</BackLink>
      <MovieInfo>
        {loading ? (
          <Title>Loading...</Title>
        ) : (
          <>
            <Column>
              <Title>{data.movie.title}</Title>
              <Subtitle>{`${data.movie.release_date.substring(0, 4)}`}</Subtitle>
              <Subtitle>{`Rating : ${data.movie.vote_average}`}</Subtitle>
              <Subtitle>
                {data?.movie?.genres?.map((genre, index) =>
                  index === data.movie.genres.length - 1 ? genre.name : `${genre.name} | `,
                )}
              </Subtitle>
              <Description>{data.movie.overview}</Description>
            </Column>
            {data?.movie?.poster_path && <Poster bg={`${POSTER_URL}${data.movie.poster_path}`} />}
          </>
        )}
      </MovieInfo>
      <Suggestions>
        <Title>Recommended movies</Title>
        <Movies>
          {data?.suggestions?.map(
            (movie) =>
              movie.poster_path && (
                <Movie key={movie.id} id={movie.id} bg={`${POSTER_URL}${movie.poster_path}`} />
              ),
          )}
        </Movies>
      </Suggestions>
    </Container>
  );
};
