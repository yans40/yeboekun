# Utiliser l'image officielle .NET 9 SDK pour la compilation
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copier les fichiers de projet et restaurer les dépendances
COPY ["src/GegeDot.API/GegeDot.API.csproj", "src/GegeDot.API/"]
COPY ["src/GegeDot.Core/GegeDot.Core.csproj", "src/GegeDot.Core/"]
COPY ["src/GegeDot.Infrastructure/GegeDot.Infrastructure.csproj", "src/GegeDot.Infrastructure/"]
COPY ["src/GegeDot.Services/GegeDot.Services.csproj", "src/GegeDot.Services/"]
COPY ["GegeDot.sln", "./"]

RUN dotnet restore "src/GegeDot.API/GegeDot.API.csproj"

# Copier tout le code source
COPY . .

# Compiler l'application
WORKDIR "/src/src/GegeDot.API"
RUN dotnet build "GegeDot.API.csproj" -c Release -o /app/build

# Publier l'application
FROM build AS publish
RUN dotnet publish "GegeDot.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Image finale avec runtime .NET 9
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Exposer le port 5000
EXPOSE 5000
EXPOSE 5001

# Variables d'environnement
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Point d'entrée
ENTRYPOINT ["dotnet", "GegeDot.API.dll"]
